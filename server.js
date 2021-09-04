import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

import ClientsTable from "./validation-classes/TableClients.js";
import EmployeesTable from "./validation-classes/TableEmployees.js";
import ToolsTable from "./validation-classes/TableTools.js";
import ToolsGroupsTable from "./validation-classes/TableToolsGroups.js";
import ToolsManagmentTable from "./validation-classes/TableToolsManagment.js";
import OfficeTable from "./validation-classes/TableOffice.js";
import ToolsPricesTable from "./validation-classes/TableToolsPrices.js";
import UnitMeasurementTable from "./validation-classes/TableUnitMeasurement.js";
import Query from "./query-class/Query.js";

const app = express();
const port = 8080;
const passwordsSalt = 10;

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// ---------------------------------------- POST
app.post("/login/employees", async (req, res) =>
{
    // session_type_id = 2
    const username = req.body.username;
    const password = req.body.password;

    const selectColumns = ["id", "password"];
    const whereParams = {
        "username": {
            operator: "like",
            value: username
        },
        "deleted_by": {
            operator: "is",
            value: "null"
        },
        "inactivated_by": {
            operator: "is", 
            value: "null"
        }
    }
    const logicalOperators = ["AND", "AND"]
    
    const result = await Query.Select("public.employees", selectColumns, whereParams, logicalOperators);
    
    if (result.data.length !== 0 && !result.error.transaction)
    {
        const userData = result.data[0];
        const storedPassword = userData.password;
        const correctedPassword = await bcrypt.compare(password, storedPassword);

        if (correctedPassword)
        {
            console.log("Correct password, able to login");
            const dataToHash = username + new Date().getTime();
            const hashedData = crypto.Hash("sha256").update(dataToHash).digest("hex");

            const columns = {
                "session_token": hashedData,
                "session_type_id": 2,
                "last_activity": "now()",
                "user_id": userData.id,
                "started_at": "now()"
            }
            const returningColumns = ["*"]

            const creatingSessions = await Query.Insert(true, "public.sessions", columns, returningColumns);

            if (creatingSessions.data.length !== 0 &&
                !creatingSessions.error.transaction &&
                !creatingSessions.error.commit &&
                !creatingSessions.error.rollback &&
                !creatingSessions.error.params)
            {
                console.log("Logged successful");
                console.table(creatingSessions.data[0]);
                res.cookie("locadoraSession", hashedData);
                res.end();
            }
            else
            {
                console.log("Fail to login", creatingSessions.error);
                res.end();
            }
        }
        else
        {
            console.log("Invalid username or password");
            res.end();
        }
    }
    else
    {
        console.log("Invalid username or password");
        res.end();
    }
});

app.post("/clients", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const fieldsValues = {};
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneDdi = req.body.phoneDdi;
    const phoneDdd = req.body.phoneDdd;
    const phoneNumber = req.body.phoneNumber;
    const username = req.body.username;
    const password = req.body.password;
    const validationError = {};

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validFirstName = ClientsTable.FirstName(firstName);
                fieldsValues["first_name"] = validFirstName;
            }
            catch (err)
            {
                console.log(err);
                validationError["first_name"] = err.message;
            }
        
            try
            {
                const validLastName = ClientsTable.LastName(lastName);
                fieldsValues["last_name"] = validLastName;
            }
            catch (err)
            {
                console.log(err);
                validationError["first_name"] = err.message;
        
            }
        
            try
            {
                const validPhoneDdi = ClientsTable.PhoneDdi(phoneDdi);
                fieldsValues["phone_ddi"] = validPhoneDdi;
            }
            catch (err)
            {
                console.log(err);
                validationError["phone_ddi"] = err.message;
            }
        
            try
            {
                const validPhoneDdd = ClientsTable.PhoneDdd(phoneDdd);
                fieldsValues["phone_ddd"] = validPhoneDdd;
            }
            catch (err)
            {
                console.log(err);
                validationError["phone_ddd"] = err.message;
            }
        
            try
            {
                const validPhoneNumber = ClientsTable.PhoneNumber(phoneNumber);
                fieldsValues["phone_number"] = validPhoneNumber;
            }
            catch (err)
            {
                console.log(err);
                validationError["phone_number"] = err.message;
            }
        
            try
            {
                const validUsername = ClientsTable.Username(username);
                fieldsValues["username"] = validUsername;
            }
            catch (err)
            {
                console.log(err);
                validationError["username"] = err.message;
            }
        
            try
            {
                const validPassword = ClientsTable.Password(password);
        
                const salt = await bcrypt.genSalt(passwordsSalt)
                const enctyptedPasswd = await bcrypt.hash(validPassword, salt);
                
                fieldsValues["password"] = enctyptedPasswd;
            }
            catch (err)
            {
                console.log(err);
                validationError["password"] = err.message;
            }
            
            if (req.body.document)
            {
                try
                {
                    const document = req.body.document;
            
                    const validDocument = ClientsTable.Document(document);
            
                    fieldsValues["document"] = validDocument;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["document"] = err.message;
                }
            }
        
            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";
                console.log("There are no validation errors, everything is ok");
                const inserting = await Query.Insert(true, "public.clients", fieldsValues, ["*"]);

                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.post("/employees", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneDdi = req.body.phoneDdi;
    const phoneDdd = req.body.phoneDdd;
    const phoneNumber = req.body.phoneNumber;
    const cpf = req.body.cpf;
    const city = req.body.city;
    const state = req.body.state;
    const address = req.body.address;
    const username = req.body.username;
    const password = req.body.password;
    const officeId = req.body.officeId;
    const fieldsValues = {};
    const validationError = {};

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        }
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validFirstName = EmployeesTable.FirstName(firstName);
                fieldsValues["first_name"] = validFirstName;
            }
            catch (err)
            {
                console.error(err);
                validationError["first_name"] = err.message;
            }
        
            try
            {
                const validLastName = EmployeesTable.LastName(lastName);
                fieldsValues["last_name"] = validLastName;
            }
            catch (err)
            {
                console.error(err);
                validationError["last_name"] = err.message;
            }
        
            try
            {
                const validPhoneDdi = EmployeesTable.PhoneDdi(phoneDdi);
                fieldsValues["phone_ddi"] = validPhoneDdi;
            }
            catch (err)
            {
                console.error(err);
                validationError["phone_ddi"] = err.message;
            }
        
            try
            {
                const validPhoneDdd = EmployeesTable.PhoneDdd(phoneDdd);
                fieldsValues["phone_ddd"] = validPhoneDdd;
            }
            catch (err)
            {
                console.error(err);
                validationError["phone_ddd"] = err.message;
            }
        
            try
            {
                const validPhoneNumber = EmployeesTable.PhoneNumber(phoneNumber);
                fieldsValues["phone_number"] = validPhoneNumber;
            }
            catch (err)
            {
                console.error(err);
                validationError["phone_number"] = err.message;
            }
        
            try
            {
                const validCpf = EmployeesTable.Cpf(cpf);
                fieldsValues["cpf"] = validCpf;
            }
            catch (err)
            {
                console.error(err);
                validationError["cpf"] = err.message;
            }
        
            try
            {
                const validUsername = EmployeesTable.Username(username);
                fieldsValues["username"] = validUsername;
            }
            catch (err)
            {
                console.error(err);
                validationError["username"] = err.message;
            }
        
            try
            {
                const validPassword = EmployeesTable.Password(password);
                const salt = await bcrypt.genSalt(passwordsSalt)
                const enctyptedPasswd = await bcrypt.hash(validPassword, salt);
        
                fieldsValues["password"] = enctyptedPasswd;
            }
            catch (err)
            {
                console.error(err);
                validationError["password"] = err.message;
            }
        
            try
            {
                const validCity = EmployeesTable.City(city);
                fieldsValues["city"] = validCity;
            }
            catch (err)
            {
                console.error(err);
                validationError["city"] = err.message;
            }
        
            try
            {
                const validState = EmployeesTable.State(state);
                fieldsValues["state"] = validState;
        
            }
            catch (err)
            {
                console.error(err);
                validationError["state"] = err.message;
            }
        
            try
            {
                const validAddress = EmployeesTable.Address(address);
                fieldsValues["address"] = validAddress;
            }
            catch (err)
            {
                console.error(err);
                validationError["address"] = err.message;
            }
        
            try
            {
                const validOfficeId = EmployeesTable.OfficeId(officeId);
                fieldsValues["office_id"] = validOfficeId;
            }
            catch (err)
            {
                console.log(err);
                validationError["office_id"] = err.message;
            }
        
            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";

                const inserting = await Query.Insert(true, "public.employees", fieldsValues, ["*"]);

                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.post("/tools-groups", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const fieldsValues = {};
    const validationError = {};
    const groupName = req.body.groupName;
    
    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validGroupName = ToolsGroupsTable.Name(groupName);
                fieldsValues["name"] = validGroupName;
            }
            catch (err)
            {
                console.log(err);
                validationError["name"] = err.message;
            }

            if (req.body.description)
            {
                try
                {
                    const validGroupDescription = ToolsGroupsTable.Description(req.body.description);
                    
                    fieldsValues["description"] = validGroupDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";

                const inserting = await Query.Insert(true, "public.tools_groups", fieldsValues, ["*"]);
                
                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session");
        res.end();    
    }
});

app.post("/tools", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const fieldsValues = {};
    const fieldsValuesPrices = {};
    const fieldsValuesManagment = {};
    const toolName = req.body.toolName;
    const toolQuantity = req.body.toolQuantity;
    const toolGroupId = req.body.toolGroupId;
    const validationError = {};
    const validationErrorPrices = {};

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validToolName = ToolsTable.Name(toolName);
                fieldsValues["name"] = validToolName;
            }
            catch (err)
            {
                console.log(err);
                validationError["name"] = err.message;
            }

            try
            {
                const validQuantity = ToolsTable.Quantity(toolQuantity);
                fieldsValues["quantity"] = validQuantity;
            }
            catch (err)
            {
                console.log(err);
                validationError["quantity"] = err.message;
            }

            try
            {
                const validToolGroupId = ToolsTable.GroupId(toolGroupId);
                fieldsValues["group_id"] = validToolGroupId;
            }
            catch (err)
            {
                console.log(err);
                validationError["group_id"] = err.message;
            }

            if (req.body.toolDescription)
            {
                try
                {
                    const validDescription = ToolsTable.Description(req.body.toolDescription);
                    fieldsValues["description"] = validDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }
            
            if (req.body.prices)
            {
                const toolPrices = req.body.prices;
                const pricesKeys = Object.keys(toolPrices);

                pricesKeys.forEach( (key) =>
                {
                    if(key === "unit")
                    {
                        try
                        {
                            const validUnit = ToolsPricesTable.Unit(toolPrices[key]);
                            fieldsValuesPrices["unit"] = validUnit;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["unit"] = err.message;
                        }
                    }
            
                    if (key === "unitMeasurementId")
                    {
                        try
                        {
                            const validUnitMeasurementId = ToolsPricesTable.UnitMeasurementId(toolPrices[key]);
                            fieldsValuesPrices["unit_measurement_id"] = validUnitMeasurementId;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["unit_measurement_id"] = err.message;
                        }
                    }
            
                    if (key === "upToAmountOfTools")
                    {
                        try
                        {
                            const validAmountOfTools = ToolsPricesTable.UpToAmountOfTools(toolPrices[key]);
                            fieldsValuesPrices["up_to_amount_of_tools"] = validAmountOfTools;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["up_to_amount_of_tools"] = err.message;
                        }
                    }
            
                    if (key === "begginingTerm")
                    {
                        try
                        {
                            const validBegginingTerm = ToolsPricesTable.BegginingTerm(toolPrices[key]);
                            fieldsValuesPrices["beggining_term"] = validBegginingTerm;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["beggining_term"] = err.message;
                        }
                    }
            
                    if (key === "endTerm")
                    {
                        try
                        {
                            const validEndTerm = ToolsPricesTable.EndTerm(toolPrices[key]);
                            fieldsValuesPrices["end_term"] = validEndTerm;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["end_term"] = err.message;
                        }
                    }
            
                    if ( key === "price")
                    {
                        try
                        {
                            const validPrice = ToolsPricesTable.Price(toolPrices[key]);
                            fieldsValuesPrices["price"] = validPrice;
                        }
                        catch (err)
                        {
                            console.log(err);
                            validationErrorPrices["price"] = err.message;
                        }
                    }
                });
            }

            if (Object.keys(validationError).length !== 0 && Object.keys(validationErrorPrices).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";
                const insertingTool = await Query.Insert(true, "public.tools", fieldsValues, ["*"]);
                
                if ( !insertingTool.error.transaction && !insertingTool.error.params &&
                    !insertingTool.error.commits && !insertingTool.error.rollback)
                {
                    console.table(insertingTool.data);
                    await updateSessionActivity(validSession);
                    const toolId = insertingTool.data[0].id;

                    if (req.body.prices)
                    {
                        fieldsValuesPrices["tool_id"] = toolId;
                        fieldsValuesPrices["created_by"] = validSession.data[0].user_id;
                        fieldsValuesPrices["created_at"] = "now()";
        
                        const insertingPrice = await Query.Insert(true, "public.tools_prices", fieldsValuesPrices, ["*"]);
    
                        if (!insertingPrice.error.transaction && !insertingPrice.error.params &&
                            !insertingPrice.error.commit && !insertingPrice.error.rollback)
                        {
                            await updateSessionActivity(validSession);
                            console.table(insertingPrice.data);
                        }
                        else
                        {
                            console.log("An error occurred while inserting tools prices", insertingPrice.error);
                            res.end();
                        }
                    }

                    fieldsValuesManagment["tool_id"] = toolId;
                    fieldsValuesManagment["available"] = insertingTool.data[0].quantity;
                    fieldsValuesManagment["total"] = insertingTool.data[0].quantity;
                    fieldsValuesManagment["rented"] = 0;
                    fieldsValuesManagment["updated_at"] = "now()";
                    fieldsValuesManagment["updated_by"] = validSession.data[0].user_id;

                    const insertingManagment = await Query.Insert(true, "public.tools_managment", fieldsValuesManagment, ["*"]);

                    if (!insertingManagment.error.transaction && !insertingManagment.error.params &&
                        !insertingManagment.error.commit && !insertingManagment.error.rollback)
                    {
                        await updateSessionActivity(validSession);
                        console.table(insertingManagment.data);
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred while inserting tool managment", insertingManagment.error);
                        res.end();
                    }
                }
                else
                {
                    console.log("An error occurred while inserting tool", insertingTool.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }

});

app.post("/unit-measurement", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const fieldsValues = {};
    const validationError = {};
    const period = req.body.period;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validPeriod = UnitMeasurementTable.Period(period);
                fieldsValues["period"] = validPeriod;
            }
            catch (err)
            {
                console.log(err);
                validationError["period"] = err.message;
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";
                const inserting = await Query.Insert(true, "public.unit_measurement", fieldsValues, ["*"]);
                
                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.post("/tools-prices", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const toolId = req.body.toolId;
    const unit = req.body.unit;
    const unitMeasurementId = req.body.unitMeasurementId;
    const upToAmountOfTools = req.body.upToAmountOfTools;
    const begginingTerm = req.body.begginingTerm;
    const endTerm = req.body.endTerm;
    const price = req.body.price;
    const fieldsValuesPrices = {};
    const validationError = {};

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validToolId = ToolsPricesTable.ToolId(toolId);
                fieldsValuesPrices["tool_id"] = validToolId;
            }
            catch (err)
            {
                console.log(err);
                validationError["tool_id"] = err.message;
            }
    
            try
            {
                const validUnit = ToolsPricesTable.Unit(unit);
                fieldsValuesPrices["unit"] = validUnit;
            }
            catch (err)
            {
                console.log(err);
                validationError["unit"] = err.message;
            }
    
            try
            {
                const validUnitMeasurementId = ToolsPricesTable.UnitMeasurementId(unitMeasurementId);
                fieldsValuesPrices["unit_measurement_id"] = validUnitMeasurementId;
            }
            catch (err)
            {
                console.log(err);
                validationError["unit_measurement_id"] = err.message;
            }
    
            try
            {
                const validAmountOfTools = ToolsPricesTable.UpToAmountOfTools(upToAmountOfTools);
                fieldsValuesPrices["up_to_amount_of_tools"] = validAmountOfTools;
            }
            catch (err)
            {
                console.log(err);
                validationError["up_to_amount_of_tools"] = err.message;
            }
    
            try
            {
                const validBegginingTerm = ToolsPricesTable.BegginingTerm(begginingTerm);
                fieldsValuesPrices["beggining_term"] = validBegginingTerm;
            }
            catch (err)
            {
                console.log(err);
                validationError["beggining_term"] = err.message;
            }
    
            try
            {
                const validEndTerm = ToolsPricesTable.EndTerm(endTerm);
                fieldsValuesPrices["end_term"] = validEndTerm;
            }
            catch (err)
            {
                console.log(err);
                validationError["end_term"] = err.message;
            }
    
            try
            {
                const validPrice = ToolsPricesTable.Price(price);
                fieldsValuesPrices["price"] = validPrice;
            }
            catch (err)
            {
                console.error(err);
                validationError["price"] = err.message;
            }
    
            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValuesPrices["created_by"] = validSession.data[0].user_id;
                fieldsValuesPrices["created_at"] = "now()";
                const inserting = await Query.Insert(true, "public.tools_prices", fieldsValuesPrices, ["*"]);
                
                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.post("/office", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const officeName = req.body.officeName;
    const officeSalary = req.body.officeSalary;
    const fieldsValues = {};
    const validationError = {};

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const whereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const logicalOperators = ["AND", "AND"]
        const validSession = await Query.Select("public.sessions", selectColumns, whereParams, logicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validOfficeName = OfficeTable.Name(officeName);
                fieldsValues["name"] = validOfficeName;
            }
            catch (err)
            {
                console.log(err);
                validationError["name"] = err.message;
            }

            try
            {
                const validOfficeSalary = OfficeTable.Salary(officeSalary);
                fieldsValues["salary"] = validOfficeSalary;
            }
            catch (err)
            {
                console.log(err);
                validationError["salary"] = err.message;
            }
            
            if (req.body.officeDescription)
            {
                try
                {
                    const officeDescription = req.body.officeDescription;
                    const validDescription = OfficeTable.Description(officeDescription);
            
                    fieldsValues["description"] = validDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["created_by"] = validSession.data[0].user_id;
                fieldsValues["created_at"] = "now()";
                const inserting = await Query.Insert(true, "public.office", fieldsValues, ["*"]);
                
                if (!inserting.error.transaction && !inserting.error.params &&
                    !inserting.error.commit && !inserting.error.rollback)
                {
                    console.table(inserting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", inserting.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

// ---------------------------------------- PUT
app.put("/clients", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const clientId = req.body.clientId;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.firstName)
            {
                try
                {
                    const firstName = req.body.firstName;
                    const validFirstName = ClientsTable.FirstName(firstName);
                    fieldsValues["first_name"] = validFirstName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["first_name"] = err.message;
                }
            }
            
            if (req.body.lastName)
            {
                try
                {
                    const lastName = req.body.lastName;
                    const validLastName = ClientsTable.LastName(lastName);
                    fieldsValues["last_name"] = validLastName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["last_name"] = err.message;
                }
            }

            if (req.body.phoneDdi)
            {
                try
                {
                    const phoneDdi = req.body.phoneDdi;
                    const validPhoneDdi = ClientsTable.PhoneDdi(phoneDdi);
                    fieldsValues["phone_ddi"] = validPhoneDdi;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_ddi"] = err.message;
                }
            }

            if (req.body.phoneDdd)
            {
                try
                {
                    const phoneDdd = req.body.phoneDdd;
                    const validPhoneDdd = ClientsTable.PhoneDdd(phoneDdd);
                    fieldsValues["phone_ddd"] = validPhoneDdd;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_ddd"] = err.message;
                }
            }

            if (req.body.phoneNumber)
            {
                try
                {
                    const phoneNumber = req.body.phoneNumber;
                    const validPhoneNumber = ClientsTable.PhoneNumber(phoneNumber);
                    fieldsValues["phone_number"] = validPhoneNumber;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_number"] = err.message;
                }
            }

            if (req.body.document)
            {
                try
                {
                    const document = req.body.document;
                    const validDocument = ClientsTable.Document(document);
                    fieldsValues["document"] = validDocument;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["document"] = err.message;
                }
            }

            if (req.body.username)
            {
                try
                {
                    const username = req.body.username;
                    const validUsername = ClientsTable.Username(username);
                    fieldsValues["username"] = validUsername;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["username"] = err.message;
                }
            }

            if (req.body.password)
            {
                try
                {
                    const password = req.body.password;
                    const validPassword = ClientsTable.Password(password);

                    const salt = await bcrypt.genSalt(passwordsSalt)
                    const enctyptedPasswd = await bcrypt.hash(validPassword, salt);
                    fieldsValues["password"] = enctyptedPasswd;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["password"] = err.message;
                }
            }

            try
            {
                const validClientId = ClientsTable.Id(clientId);
                whereColumns.id["value"] = validClientId;
            }
            catch (err)
            {
                console.log(err);
                validationError["client_id"] = err.message;
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.clients", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
            console.log(fieldsValues);
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }


});

app.put("/employees", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const employeeId = req.body.employeeId;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.firstName)
            {
                try
                {
                    const firstName = req.body.firstName;
                    const validFirstName = ClientsTable.FirstName(firstName);
                    fieldsValues["first_name"] = validFirstName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["first_name"] = err.message;
                }
            }
            
            if (req.body.lastName)
            {
                try
                {
                    const lastName = req.body.lastName;
                    const validLastName = ClientsTable.LastName(lastName);
                    fieldsValues["last_name"] = validLastName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["last_name"] = err.message;
                }
            }

            if (req.body.phoneDdi)
            {
                try
                {
                    const phoneDdi = req.body.phoneDdi;
                    const validPhoneDdi = ClientsTable.PhoneDdi(phoneDdi);
                    fieldsValues["phone_ddi"] = validPhoneDdi;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_ddi"] = err.message;
                }
            }

            if (req.body.phoneDdd)
            {
                try
                {
                    const phoneDdd = req.body.phoneDdd;
                    const validPhoneDdd = ClientsTable.PhoneDdd(phoneDdd);
                    fieldsValues["phone_ddd"] = validPhoneDdd;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_ddd"] = err.message;
                }
            }

            if (req.body.phoneNumber)
            {
                try
                {
                    const phoneNumber = req.body.phoneNumber;
                    const validPhoneNumber = ClientsTable.PhoneNumber(phoneNumber);
                    fieldsValues["phone_number"] = validPhoneNumber;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["phone_number"] = err.message;
                }
            }

            if (req.body.cpf)
            {
                try
                {
                    const document = req.body.cpf;
                    const validDocument = ClientsTable.Document(document);
                    fieldsValues["cpf"] = validDocument;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["cpf"] = err.message;
                }
            }

            if (req.body.username)
            {
                try
                {
                    const username = req.body.username;
                    const validUsername = ClientsTable.Username(username);
                    fieldsValues["username"] = validUsername;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["username"] = err.message;
                }
            }

            if (req.body.password)
            {
                try
                {
                    const password = req.body.password;
                    const validPassword = ClientsTable.Password(password);

                    const salt = await bcrypt.genSalt(passwordsSalt)
                    const enctyptedPasswd = await bcrypt.hash(validPassword, salt);
                    fieldsValues["password"] = enctyptedPasswd;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["password"] = err.message;
                }
            }

            if (req.body.city)
            {
                try
                {
                    const city = req.body.city;
                    const validCity = EmployeesTable.City(city);
                    fieldsValues["city"] = validCity;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["city"] = err.message;
                }
            }

            if (req.body.state)
            {
                try
                {
                    const state = req.body.state;
                    const validState = EmployeesTable.State(state);
                    fieldsValues["state"] = validState;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["state"] = err.message;
                }
            }

            if (req.body.address)
            {
                try
                {
                    const address = req.body.address;
                    const validAddress = EmployeesTable.Address(address);
                    fieldsValues["address"] = validAddress;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["address"] = err.message;
                }
            }

            if (req.body.officeId)
            {
                try
                {
                    const officeId = req.body.officeId;
                    const validOfficeId = EmployeesTable.OfficeId(officeId);
                    fieldsValues["office_id"] = validOfficeId;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["office_id"] = err.message;
                }
            }

            try
            {
                const validEmployeeId = EmployeesTable.Id(employeeId);
                whereColumns.id["value"] = validEmployeeId;
            }
            catch (err)
            {
                console.log(err);
                validationError["employee_id"] = err.message;
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.employees", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.put("/tools-groups", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const groupId = req.body.groupId;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.groupName)
            {
                try
                {
                    const groupName = req.body.groupName;
                    const validGroupName = ToolsGroupsTable.Name(groupName);

                    fieldsValues["name"] = validGroupName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["name"] = err.message;
                }
            }

            if (req.body.description)
            {
                try
                {
                    const validGroupDescription = ToolsGroupsTable.Description(req.body.description);
                    fieldsValues["description"] = validGroupDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }

            try
            {
                const validId = ToolsGroupsTable.Id(groupId);
                whereColumns.id["value"] = validId;
            }
            catch (err)
            {
                console.log(err);
                validationError["group_id"] = err.message;
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.tools_groups", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }

});

app.put("/tools", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const toolId = req.body.toolId;
    const fieldsValues = {};
    const fieldsValuesManagment = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.toolName)
            {
                try
                {
                    const toolName = req.body.toolName;
                    const validToolName = ToolsTable.Name(toolName);

                    fieldsValues["name"] = validToolName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["name"] = err.message;
                }
            }

            if (req.body.toolQuantity)
            {
                try
                {
                    const toolQuantity = req.body.toolQuantity;
                    const validQuantity = ToolsTable.Quantity(toolQuantity);
                    const validToolId = ToolsTable.Id(toolId);

                    const selectGetColumns = ["available"];
                    const selectGetWhereParams = {
                        tool_id: {
                            operator: "=",
                            value: validToolId,
                        }
                    };
                    const selectGetLogicalOperators = [""];

                    const getResult = await Query.Select("public.tools_managment", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators);
                    
                    if (!getResult.error.transaction && !getResult.error.params &&
                        !getResult.error.commit && !getResult.error.rollback)
                    {
                        console.table(getResult.data);
                        const currentAvailable = getResult.data[0].available;
                        const difference = validQuantity - currentAvailable;
    
                        fieldsValues["quantity"] = validQuantity;
                        fieldsValuesManagment["total"] = validQuantity;
                        fieldsValuesManagment["available"] = `${currentAvailable + difference}`;
                        fieldsValuesManagment["updated_at"] = "now()";
                        fieldsValuesManagment["updated_by"] = validSession.data[0].user_id;
                    }
                    else
                    {
                        console.log("An error occurred", getResult.error);
                        res.end();
                    }

                }
                catch (err)
                {
                    console.log(err);
                    validationError["quantity"] = err.message;
                }
            }

            if (req.body.toolGroupId)
            {
                try
                {
                    const toolGroupId = req.body.toolGroupId;
                    const validToolGroupId = ToolsTable.GroupId(toolGroupId);

                    fieldsValues["group_id"] = validToolGroupId;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["group_id"] = err.message;
                }
            }
            
            if (req.body.toolDescription)
            {
                try
                {
                    const validDescription = ToolsTable.Description(req.body.toolDescription);

                    fieldsValues["description"] = validDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }

            try
            {
                const validToolId = ToolsTable.Id(toolId);
                whereColumns.id["value"] = validToolId;
            }
            catch (err)
            {
                console.log(err);
                validationError["tool_id"] = err.message;
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.tools", fieldsValues, ["*"], whereColumns, [""]);
                
                if ( !updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback )
                {   
                    console.table(updating.data);
                    await updateSessionActivity(validSession);

                    const whereColumnsManagment = {
                        tool_id : {
                            operator : "=",
                            value : updating.data[0].id
                        }
                    }
                    const updatingManagment = await Query.Update(true, "public.tools_managment", fieldsValuesManagment, ["*"], whereColumnsManagment, [""]);
                    
                    if (!updatingManagment.error.transaction && !updatingManagment.error.params &&
                        !updatingManagment.error.commit && !updatingManagment.error.rollback)
                    {
                        console.log(updatingManagment);
                        await updateSessionActivity(validSession);
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred", updatingManagment.error);
                        res.end();
                    }
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }

});

app.put("/unit-measurement", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const id = req.body.id;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.period)
            {
                try
                {
                    const period = req.body.period;
                    const validPeriod = UnitMeasurementTable.Period(period);

                    fieldsValues["period"] = validPeriod;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["period"] = err.message;
                }
            }

            try
            {
                const validUnitMeasurementId = UnitMeasurementTable.Id(id);
                whereColumns.id["value"] = validUnitMeasurementId;
            }
            catch (err)
            {
                console.log(err);
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.unit_measurement", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.put("/tools-prices", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const id = req.body.id;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.toolId)
            {
                try
                {
                    const toolId = req.body.toolId;
                    const validToolId = ToolsPricesTable.ToolId(toolId);

                    fieldsValues["tool_id"] = validToolId;

                }
                catch (err)
                {
                    console.log(err);
                    validationError["tool_id"] = err.message;
                }
            }

            if (req.body.unit)
            {
                try
                {
                    const unit = req.body.unit;
                    const validUnit = ToolsPricesTable.Unit(unit);
                    fieldsValues["unit"] = validUnit;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["unit"] = err.message;
                }
            }

            if (req.body.unitMeasurementId)
            {
                try
                {
                    const unitMeasurementId = req.body.unitMeasurementId;
                    const validUnitMeasurementId = ToolsPricesTable.UnitMeasurementId(unitMeasurementId);

                    fieldsValues["unit_measurement_id"] = validUnitMeasurementId;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["unit_measurement_id"] = err.message;
                }
            }

            if (req.body.upToAmountOfTools)
            {
                try
                {
                    const upToAmountOfTools = req.body.upToAmountOfTools;
                    const validAmountOfTools = ToolsPricesTable.UpToAmountOfTools(upToAmountOfTools);

                    fieldsValues["up_to_amount_of_tools"] = validAmountOfTools;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["up_to_amount_of_tools"] = err.message;
                }
            }

            if (req.body.begginingTerm)
            {
                try
                {
                    const begginingTerm = req.body.begginingTerm;
                    const validBegginingTerm = ToolsPricesTable.BegginingTerm(begginingTerm);
                    fieldsValues["beggining_term"] = validBegginingTerm;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["beggining_term"] = err.message;
                }
            }

            if (req.body.endTerm)
            {
                try
                {
                    const endTerm = req.body.endTerm;
                    const validEndTerm = ToolsPricesTable.EndTerm(endTerm);
                    fieldsValues["end_term"] = validEndTerm;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["end_term"] = err.message;
                }
            }

            if (req.body.price)
            {
                try
                {
                    const price = req.body.price;
                    const validPrice = ToolsPricesTable.Price(price);
                    fieldsValues["price"] = validPrice;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["price"] = err.message;
                }
            }

            try
            {
                const validPriceId = ToolsPricesTable.Id(id);
                whereColumns.id["value"] = validPriceId;
            }
            catch (err)
            {
                console.log(err);
                validationError["tools_prices_id"] = err
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.tools_prices", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.put("/office", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const officeId = req.body.officeId;
    const fieldsValues = {};
    const validationError = {};
    const whereColumns = {
        "id": {
            operator: "=",
        }
    };

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            if (req.body.officeName)
            {
                try
                {
                    const officeName = req.body.officeName;
                    const validOfficeName = OfficeTable.Name(officeName);

                    fieldsValues["name"] = validOfficeName;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["name"] = err.message;
                }
            }

            if (req.body.officeSalary)
            {
                try
                {
                    const officeSalary = req.body.officeSalary;
                    const validofficeSalary = OfficeTable.Salary(officeSalary);

                    fieldsValues["salary"] = validofficeSalary;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["salary"] = err.message;
                }
            }
            
            if (req.body.officeDescription)
            {
                try
                {
                    const validDescription = OfficeTable.Description(req.body.officeDescription);

                    fieldsValues["description"] = validDescription;
                }
                catch (err)
                {
                    console.log(err);
                    validationError["description"] = err.message;
                }
            }

            try
            {
                const validOfficeId = OfficeTable.Id(officeId);
                whereColumns.id["value"] = validOfficeId;
            }
            catch (err)
            {
                console.log(err);
                validationError["office_id"] = err
            }

            if (Object.keys(validationError).length !== 0)
            {
                console.log("There are some validation errors\n", validationError);
                res.end();
            }
            else
            {
                fieldsValues["updated_by"] = validSession.data[0].user_id;
                fieldsValues["updated_at"] = "now();";

                const updating = await Query.Update(true, "public.office", fieldsValues, ["*"], whereColumns, [""]);
                
                if (!updating.error.transaction && !updating.error.params &&
                    !updating.error.commit && !updating.error.rollback)
                {
                    console.table(updating.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", updating.error);
                    res.end();
                }
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

// ---------------------------------------- DELETE
app.delete("/clients/:clientId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const clientId = req.params.clientId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validClientId = ClientsTable.Id(clientId);
                const updatingColumns = {
                    deleted_at: "now()",
                    deleted_by: validSession.data[0].user_id
                };
                const returningColumns =  ["id", "deleted_at"];
                const whereColumns = {
                    id: {
                        operator: "=",
                        value: validClientId
                    }
                };

                const deleting = await Query.Update(true, "public.clients", updatingColumns, returningColumns, whereColumns, [""]);

                if (!deleting.error.transaction && !deleting.error.params &&
                    !deleting.error.commit && !deleting.error.rollback)
                {
                    console.table(deleting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", deleting.error);
                    res.end();
                }
            }
            catch (err)
            {
                console.log(err);
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/employees/:employeeId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const employeeId = req.params.employeeId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validEmployeeId = EmployeesTable.Id(employeeId);
                const selectColumns = ["id", "created_by", "updated_by"];
                const selectColumnsToolsManagment = ["updated_by", "deleted_by"];
                const whereParams = {
                    "created_by": {
                        operator: "=",
                        value: validEmployeeId
                    },
                    "updated_by": {
                        operator: "=", 
                        value: validEmployeeId
                    },
                    "deleted_by": {
                        operator: "=", 
                        value: validEmployeeId
                    },
                    "inactivated_by": {
                        operator: "=", 
                        value: validEmployeeId
                    }
                };
                const whereParamsToolsManagment = {
                    "updated_by": {
                        operator: "=", 
                        value: validEmployeeId
                    },
                    "deleted_by": {
                        operator: "=", 
                        value: validEmployeeId
                    },
                };
                const logicalOperators = ["OR", "OR", "OR"];
                const logicalOperatorsToolsManagment = ["OR"];

                const usedInClients = await Query.Select("public.clients", selectColumns, whereParams, logicalOperators);
                const usedInEmployees = await Query.Select("public.employees", selectColumns, whereParams, logicalOperators);
                const usedInOffice = await Query.Select("public.office", selectColumns, whereParams, logicalOperators);
                const usedInTools = await Query.Select("public.tools", selectColumns, whereParams, logicalOperators);
                const usedInToolsGroups = await Query.Select("public.tools_groups", selectColumns, whereParams, logicalOperators);
                const usedInToolsManagment = await Query.Select("public.tools_managment", selectColumnsToolsManagment, whereParamsToolsManagment, logicalOperatorsToolsManagment);
                const usedInToolsPrices = await Query.Select("public.tools_prices", selectColumns, whereParams, logicalOperators);
                const usedInUnitMeasurement = await Query.Select("public.unit_measurement", selectColumns, whereParams, logicalOperators);

                if (usedInClients.data.length !== 0 || usedInEmployees.data.length !== 0 ||
                    usedInOffice.data.length !== 0 || usedInTools.data.length !== 0 ||
                    usedInToolsGroups.data.length !== 0 || usedInToolsManagment.data.length !== 0 || 
                    usedInToolsPrices.data.length !== 0 || usedInUnitMeasurement.data.length !== 0) 
                {
                    const updatingColumns = {
                        inactivated_at: "now()",
                        inactivated_by: validSession.data[0].user_id
                    };
                    const returningColumns =  ["id", "inactivated_at"];
                    const whereColumns = {
                        id: {
                            operator: "=",
                            value: validEmployeeId
                        }
                    };

                    
                    const deleting = await Query.Update(true, "public.employees", updatingColumns, returningColumns, whereColumns, [""]);
                    
                    if (!deleting.error.transaction && !deleting.error.params &&
                        !deleting.error.commit && !deleting.error.rollback)
                    {
                        console.table(deleting.data);
                        await updateSessionActivity(validSession);

                        if( validSession.data[0].user_id === validEmployeeId )
                        {
                            const updatingSessionColumns = {
                                ended_at: "now()"
                            };
                            const returningSessionColumns =  ["*"];
                            const whereSessionColumns = {
                                id: {
                                    operator: "=",
                                    value: validSession.data[0].id
                                }
                            };
                
                            const logout = await Query.Update(true, "public.sessions", updatingSessionColumns, returningSessionColumns, whereSessionColumns, [""]);
                
                            if ( !logout.error.transaction && !logout.error.params && !logout.error.commit && !logout.error.rollback)
                            {
                                console.log("Logged off successful");
                                res.clearCookie("locadoraSession");
                                res.end();
                            }
                            else
                            {
                                console.log("An error occurred while logging of", logout.error);
                                res.end();
                            }
                        }
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred", deleting.error);
                        res.end();
                    }
                }
                else
                {
                    if (!usedInClients.error.transaction !== 0 && !usedInEmployees.error.transaction !== 0 &&
                        !usedInOffice.error.transaction !== 0 && !usedInTools.error.transaction !== 0 &&
                        !usedInToolsGroups.error.transaction !== 0 && !usedInToolsManagment.error.transaction !== 0 && 
                        !usedInToolsPrices.error.transaction !== 0 && !usedInUnitMeasurement.error.transaction !== 0)
                    {
                        const updatingColumns = {
                            deleted_at: "now()",
                            deleted_by: validSession.data[0].user_id
                        };
                        const returningColumns =  ["id", "deleted_at"];
                        const whereColumns = {
                            id: {
                                operator: "=",
                                value: validEmployeeId
                            }
                        };
                        
                        const deleting = await Query.Update(true, "public.employees", updatingColumns, returningColumns, whereColumns, [""]);
                        
                        if (!deleting.error.transaction && !deleting.error.params &&
                            !deleting.error.commit && !deleting.error.rollback)
                        {
                            console.table(deleting.data);
                            await updateSessionActivity(validSession);

                            if( validSession.data[0].user_id === validEmployeeId )
                            {
                                const updatingSessionColumns = {
                                    ended_at: "now()"
                                };
                                const returningSessionColumns =  ["*"];
                                const whereSessionColumns = {
                                    id: {
                                        operator: "=",
                                        value: validSession.data[0].id
                                    }
                                };
                    
                                const logout = await Query.Update(true, "public.sessions", updatingSessionColumns, returningSessionColumns, whereSessionColumns, [""]);
                    
                                if ( !logout.error.transaction && !logout.error.params && !logout.error.commit && !logout.error.rollback)
                                {
                                    console.log("Logged off successful");
                                    res.clearCookie("locadoraSession");
                                    res.end();
                                }
                                else
                                {
                                    console.log("An error occurred while logging of", logout.error);
                                    res.end();
                                }
                            }
                            res.end();
                        }
                        else
                        {
                            console.log("An error occurred", deleting.error);
                            res.end();
                        }
                    }
                    else
                    {
                        console.log("Error");
                        res.end();
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/tools-groups/:groupId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const groupId = req.params.groupId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validGroupId = ToolsGroupsTable.Id(groupId);
                const selectColumns = ["id", "group_id"];
                const whereParams = {
                    "group_id": {
                        operator: "=",
                        value: validGroupId
                    }
                }

                const usedInTools = await Query.Select("public.tools", selectColumns, whereParams, [""]);

                if (usedInTools.data.length !== 0)
                {
                    const updatingColumns = {
                        inactivated_at: "now()",
                        inactivated_by: validSession.data[0].user_id
                    };
                    const returningColumns =  ["id", "inactivated_at"];
                    const whereColumns = {
                        id: {
                            operator: "=",
                            value: validGroupId
                        }
                    };

                    const deleting = await Query.Update(true, "public.tools_groups", updatingColumns, returningColumns, whereColumns, [""]);
                    
                    if (!deleting.error.transaction && !deleting.error.params &&
                        !deleting.error.commit && !deleting.error.rollback)
                    {
                        console.table(deleting.data);
                        await updateSessionActivity(validSession);
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred", deleting.error);
                        res.end();
                    }
                }
                else
                {
                    if (!usedInTools.error.transaction)
                    {
                        const updatingColumns = {
                            deleted_at: "now()",
                            deleted_by: validSession.data[0].user_id
                        };
                        const returningColumns =  ["id", "deleted_at"];
                        const whereColumns = {
                            id: {
                                operator: "=",
                                value: validGroupId
                            }
                        };
                        
                        const deleting = await Query.Update(true, "public.tools_groups", updatingColumns, returningColumns, whereColumns, [""]);
                        
                        if (!deleting.error.transaction && !deleting.error.params &&
                            !deleting.error.commit && !deleting.error.rollback)
                        {
                            console.table(deleting.data);
                            await updateSessionActivity(validSession);
                            res.end();
                        }
                        else
                        {
                            console.log("An error occurred", deleting.error);
                            res.end();
                        }
                    }
                    else
                    {
                        console.log(usedInTools.error.transaction);
                        res.end();
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/tools/:toolId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const toolId = req.params.toolId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validToolId = ToolsTable.Id(toolId);
                const selectColumns = ["id", "tool_id"];
                const whereParams = {
                    "tool_id": {
                        operator: "=",
                        value: validToolId
                    }
                }

                const usedInToolsPrices = await Query.Select("public.tools_prices", selectColumns, whereParams, [""]);
                console.log(usedInToolsPrices);

                if (usedInToolsPrices.data.length !== 0)
                {
                    const updatingColumns = {
                        inactivated_at: "now()",
                        inactivated_by: validSession.data[0].user_id
                    };
                    const returningColumns =  ["id", "deleted_at"];
                    const whereColumns = {
                        id: {
                            operator: "=",
                            value: validToolId
                        }
                    };

                    const deleting = await Query.Update(true, "public.tools", updatingColumns, returningColumns, whereColumns, [""]);

                    if (!deleting.error.transaction && !deleting.error.params &&
                        !deleting.error.rollback && !deleting.error.commit)
                    {
                        console.error(deleting)
                        await updateSessionActivity(validSession);
                        const wherePricesColumns = {
                            tool_id: {
                                operator: "=",
                                value: validToolId
                            }
                        }
                        const deletingPrices = await Query.Update(true, "public.tools_prices", updatingColumns, returningColumns, wherePricesColumns, [""]);

                        if (!deletingPrices.error.transaction && !deletingPrices.error.params &&
                            !deletingPrices.error.commit && !deletingPrices.error.rollback)
                        {
                            console.log(deletingPrices);
                            await updateSessionActivity(validSession);

                            const updatingManagmentColumns = {
                                deleted_at: "now()",
                                deleted_by: validSession.data[0].user_id
                            };
                            const returningManagmentColumns =  ["tool_id", "deleted_at"];
                            const whereManagmentColumns = {
                                tool_id: {
                                    operator: "=",
                                    value: validToolId
                                }
                            }
    
                            const deletingManagment = await Query.Update(true, "public.tools_managment", updatingManagmentColumns, returningManagmentColumns, whereManagmentColumns, [""]);

                            if (!deletingManagment.error.transaction && !deletingManagment.error.params &&
                                !deletingManagment.error.commit && !deletingManagment.error.rollback)
                            {
                                console.log(deletingManagment);
                                await updateSessionActivity(validSession);
                                res.end();
                            }
                            else
                            {
                                console.log("An error occurred", deletingManagment.error);
                                res.end();
                            }
                        }
                        else
                        {
                            console.log("An error occurred", deletingPrices.error);
                            res.end();
                        }

                    }
                    else
                    {
                        console.log("An error occurred", deleting.error);
                        res.end();
                    }
                }
                else
                {
                    if (!usedInToolsPrices.error.transaction)
                    {
                        const updatingColumns = {
                            deleted_at: "now()",
                            deleted_by: validSession.data[0].user_id
                        };
                        const returningColumns =  ["id", "deleted_at"];
                        const whereColumns = {
                            id: {
                                operator: "=",
                                value: validToolId
                            }
                        };
                        
                        const deleting = await Query.Update(true, "public.tools", updatingColumns, returningColumns, whereColumns, [""]);
                        
                        if (!deleting.error.transaction && !deleting.error.params &&
                            !deleting.error.rollback && !deleting.error.commit)
                        {
                            console.table(deleting.data);
                            await updateSessionActivity(validSession);
                            const updatingManagmentColumns = {
                                deleted_at: "now()",
                                deleted_by: validSession.data[0].user_id
                            };
                            const returningManagmentColumns =  ["tool_id", "deleted_at"];
                            const whereManagmentColumns = {
                                tool_id: {
                                    operator: "=",
                                    value: validToolId
                                }
                            }
    
                            const deletingManagment = await Query.Update(true, "public.tools_managment", updatingManagmentColumns, returningManagmentColumns, whereManagmentColumns, [""]);

                            if (!deletingManagment.error.transaction && !deletingManagment.error.params &&
                                !deletingManagment.error.commit && !deletingManagment.error.rollback)
                            {
                                console.log(deletingManagment);
                                await updateSessionActivity(validSession);
                                res.end();
                            }
                            else
                            {
                                console.log("An error occurred", deletingManagment.error);
                                res.end();
                            }
                        }
                        else
                        {
                            console.log("An error occurred", deleting.error);
                            res.end();
                        }
                    }
                    else
                    {
                        console.log(usedInToolsPrices.error.transaction);
                        res.end();
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/unit-measurement/:unitMeasurementId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const unitMeasurementId = req.params.unitMeasurementId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validUnitMeasurementId = UnitMeasurementTable.Id(unitMeasurementId);
                const selectColumns = ["id", "unit_measurement_id"];
                const whereParams = {
                    "unit_measurement_id": {
                        operator: "=",
                        value: validUnitMeasurementId
                    }
                }

                const usedInToolsPrices = await Query.Select("public.tools_prices", selectColumns, whereParams, [""]);

                if (usedInToolsPrices.data.length !== 0)
                {
                    const updatingColumns = {
                        inactivated_at: "now()",
                        inactivated_by: validSession.data[0].user_id
                    };
                    const returningColumns =  ["id", "inactivated_at"];
                    const whereColumns = {
                        id: {
                            operator: "=",
                            value: validUnitMeasurementId
                        }
                    };

                    const deleting = await Query.Update(true, "public.unit_measurement", updatingColumns, returningColumns, whereColumns, [""]);
                    
                    if (!deleting.error.transaction && !deleting.error.params &&
                        !deleting.error.commit && !deleting.error.rollback)
                    {
                        console.table(deleting.data);
                        await updateSessionActivity(validSession);
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred", deleting.error);
                        res.end();
                    }
                }
                else
                {
                    if (!usedInToolsPrices.error.transaction)
                    {
                        const updatingColumns = {
                            deleted_at: "now()",
                            deleted_by: validSession.data[0].user_id
                        };
                        const returningColumns =  ["id", "deleted_at"];
                        const whereColumns = {
                            id: {
                                operator: "=",
                                value: validUnitMeasurementId
                            }
                        };
                        
                        const deleting = await Query.Update(true, "public.unit_measurement", updatingColumns, returningColumns, whereColumns, [""]);
                        
                        if (!deleting.error.transaction && !deleting.error.params &&
                            !deleting.error.commit && !deleting.error.rollback)
                        {
                            console.table(deleting.data);
                            await updateSessionActivity(validSession);
                            res.end();
                        }
                        else
                        {
                            console.log("An error occurred", deleting.error);
                            res.end();
                        }
                    }
                    else
                    {
                        console.log(usedInToolsPrices.error.transaction);
                        res.end();
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/tools-prices/:toolPricesId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const toolPricesId = req.params.toolPricesId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validToolPriceId = ToolsPricesTable.Id(toolPricesId);
                const updatingColumns = {
                    deleted_at: "now()",
                    deleted_by: validSession.data[0].user_id
                };
                const returningColumns =  ["id", "deleted_at"];
                const whereColumns = {
                    id: {
                        operator: "=",
                        value: validToolPriceId
                    }
                };

                const deleting = await Query.Update(true, "public.tools_prices", updatingColumns, returningColumns, whereColumns, [""]);
                
                if (!deleting.error.transaction && !deleting.error.params &&
                    !deleting.error.commit && !deleting.error.rollback)
                {
                    console.table(deleting.data);
                    await updateSessionActivity(validSession);
                    res.end();
                }
                else
                {
                    console.log("An error occurred", deleting.error);
                    res.end();
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.delete("/office/:officeId", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;
    const officeId = req.params.officeId;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            try
            {
                const validOfficeId = OfficeTable.Id(officeId);
                const selectColumns = ["id", "office_id"];
                const whereParams = {
                    "office_id": {
                        operator: "=",
                        value: validOfficeId
                    }
                }

                const usedInEmployees = await Query.Select("public.employees", selectColumns, whereParams, [""]);

                if (usedInEmployees.data.length !== 0)
                {
                    const updatingColumns = {
                        inactivated_at: "now()",
                        inactivated_by: validSession.data[0].user_id
                    };
                    const returningColumns =  ["id", "inactivated_at"];
                    const whereColumns = {
                        id: {
                            operator: "=",
                            value: validOfficeId
                        }
                    };

                    const deleting = await Query.Update(true, "public.office", updatingColumns, returningColumns, whereColumns, [""]);
                    
                    if (!deleting.error.transaction && !deleting.error.params &&
                        !deleting.error.commit && !deleting.error.rollback)
                    {
                        console.table(deleting.data);
                        await updateSessionActivity(validSession);
                        res.end();
                    }
                    else
                    {
                        console.log("An error occurred", deleting.error);
                        res.end();
                    }
                }
                else
                {
                    if (!usedInEmployees.error.transaction)
                    {
                        const updatingColumns = {
                            deleted_at: "now()",
                            deleted_by: validSession.data[0].user_id
                        };
                        const returningColumns =  ["id", "deleted_at"];
                        const whereColumns = {
                            id: {
                                operator: "=",
                                value: validOfficeId
                            }
                        };
                        
                        const deleting = await Query.Update(true, "public.office", updatingColumns, returningColumns, whereColumns, [""]);
                        
                        if (!deleting.error.transaction && !deleting.error.params &&
                            !deleting.error.commit && !deleting.error.rollback)
                        {
                            console.table(deleting.data);
                            await updateSessionActivity(validSession);
                            res.end();
                        }
                        else
                        {
                            console.log("An error occurred", deleting.error);
                            res.end();
                        }
                    }
                    else
                    {
                        console.log(usedInEmployees.error.transaction);
                        res.end();
                    }
                }
            }
            catch (err)
            {
                console.log(err);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

// ---------------------------------------- GET
app.get("/clients", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);
        console.log(validSession);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.clients", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/employees", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.employees", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/tools-groups", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.tools_groups", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/tools", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.tools", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/unit-measurement", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.unit_measurement", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/tools-prices", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.tools_prices", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/office", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["id"];

            const getResult = await Query.Select("public.office", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/tools-managment", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const selectGetColumns = ["*"];
            const selectGetWhereParams = {};
            const selectGetLogicalOperators = [""];
            const selectGetOrderBy = ["tool_id"];

            const getResult = await Query.Select("public.tools_managment", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);
            
            if (!getResult.error.transaction && !validSession.error.params)
            {
                console.table(getResult.data);
                res.end();
            }
            else
            {
                console.log("Some error occurred", getResult.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    }
});

app.get("/logoff", async (req, res) =>
{
    const cookie = req.cookies.locadoraSession;

    if (cookie)
    {
        const selectColumns = ["id", "user_id"];
        const selectWhereParams = {
            "session_token": {
                operator: "like",
                value: cookie
            },
            "session_type_id": {
                operator: "=",
                value: 2
            },
            "ended_at": {
                operator: "is", 
                value: null
            }
        };
        const selectLogicalOperators = ["AND", "AND"];
        const validSession = await Query.Select("public.sessions", selectColumns, selectWhereParams, selectLogicalOperators);

        if (validSession.data.length === 1 && !validSession.error.transaction)
        {
            const updatingSessionColumns = {
                ended_at: "now()"
            };
            const returningSessionColumns =  ["*"];
            const whereSessionColumns = {
                id: {
                    operator: "=",
                    value: validSession.data[0].id
                }
            };

            const logout = await Query.Update(true, "public.sessions", updatingSessionColumns, returningSessionColumns, whereSessionColumns, [""]);

            if ( !logout.error.transaction && !logout.error.params && !logout.error.commit && !logout.error.rollback)
            {
                console.log("Logged off successful");
                res.clearCookie("locadoraSession");
                res.end();
            }
            else
            {
                console.log("An error occurred while logging of", logout.error);
                res.end();
            }
        }
        else
        {
            console.log("You don't have a valid session!");
            res.end();
        }
    }
    else
    {
        console.log("You don't have a valid session!");
        res.end();
    } 
});

app.get("/sessions", async (req, res) =>
{
        const selectGetColumns = ["*"];
        const selectGetWhereParams = {};
        const selectGetLogicalOperators = [""];
        const selectGetOrderBy = ["id"];
        const getResult = await Query.Select("public.sessions", selectGetColumns, selectGetWhereParams, selectGetLogicalOperators, selectGetOrderBy);

        if (!getResult.error.transaction && !getResult.error.params)
        {
            console.table(getResult.data);
            res.end();
        }
        else
        {
            console.log("Some error occurred", getResult.error);
            res.end();
        }
});

app.listen(port);

async function updateSessionActivity (_validSession)
{
    const validSession = _validSession;

    const updatingSessionColumns = {
        last_activity: "now()"
    };
    const returningSessionColumns =  ["id", "user_id", "last_activity"];
    const whereSessionColumns = {
        id: {
            operator: "=",
            value: validSession.data[0].id
        }
    };

    await Query.Update(true, "public.sessions", updatingSessionColumns, returningSessionColumns, whereSessionColumns, [""]);
}