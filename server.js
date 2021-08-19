import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import pg from "pg";

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
app.post("/login/employees", (req, res) =>
{
    const username = req.body.username;
    const password = req.body.password;
});

app.post("/clients", async (req, res) =>
{
    const fieldsValues = {};
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneDdi = req.body.phoneDdi;
    const phoneDdd = req.body.phoneDdd;
    const phoneNumber = req.body.phoneNumber;
    const username = req.body.username;
    const password = req.body.password;

    try
    {
        const validFirstName = ClientsTable.FirstName(firstName);

        fieldsValues["first_name"] = validFirstName;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validLastName = ClientsTable.LastName(lastName);

        fieldsValues["last_name"] = validLastName;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validPhoneDdi = ClientsTable.PhoneDdi(phoneDdi);

        fieldsValues["phone_ddi"] = validPhoneDdi;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validPhoneDdd = ClientsTable.PhoneDdd(phoneDdd);

        fieldsValues["phone_ddd"] = validPhoneDdd;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validPhoneNumber = ClientsTable.PhoneNumber(phoneNumber);

        fieldsValues["phone_number"] = validPhoneNumber;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validUsername = ClientsTable.Username(username);

        fieldsValues["username"] = validUsername;
    }
    catch (err)
    {
        console.log(err);
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
        }
    }
});

app.post("/employees", async (req, res) =>
{
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

    try
    {
        const validFirstName = EmployeesTable.FirstName(firstName);

        fieldsValues["first_name"] = validFirstName;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validLastName = EmployeesTable.LastName(lastName);

        fieldsValues["last_name"] = validLastName;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validPhoneDdi = EmployeesTable.PhoneDdi(phoneDdi);

        fieldsValues["phone_ddi"] = validPhoneDdi;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validPhoneDdd = EmployeesTable.PhoneDdd(phoneDdd);

        fieldsValues["phone_ddd"] = validPhoneDdd;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validPhoneNumber = EmployeesTable.PhoneNumber(phoneNumber);

        fieldsValues["phone_number"] = validPhoneNumber;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validCpf = EmployeesTable.Cpf(cpf);

        fieldsValues["cpf"] = validCpf;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validUsername = EmployeesTable.Username(username);

        fieldsValues["username"] = validUsername;
    }
    catch (err)
    {
        console.error(err);
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
    }

    try
    {
        const validCity = EmployeesTable.City(city);

        fieldsValues["city"] = validCity;
    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validState = EmployeesTable.State(state);

        fieldsValues["state"] = validState;

    }
    catch (err)
    {
        console.error(err);
    }

    try
    {
        const validAddress = EmployeesTable.Address(address);

        fieldsValues["address"] = validAddress;

    }
    catch (err)
    {
        console.error(err);
    }


    try
    {
        const validOfficeId = EmployeesTable.OfficeId(officeId);

        fieldsValues["office_id"] = validOfficeId;
    }
    catch (err)
    {
        console.log(err);
    }

});

app.post("/tools-groups", (req, res) =>
{
    const fieldsValues = {};
    const groupName = req.body.groupName;
    
    try
    {
        const validGroupName = ToolsGroupsTable.Name(groupName);
        fieldsValues["name"] = validGroupName;
    
    }
    catch (err)
    {
        console.log(err);
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
        }
    }
});

app.post("/tools", (req, res) =>
{
    const fieldsValues = {};
    const toolName = req.body.toolName;
    const toolQuantity = req.body.toolQuantity;
    const toolGroupId = req.body.toolGroupId;

    try
    {
        const validToolName = ToolsTable.Name(toolName);
        fieldsValues["name"] = validToolName;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validQuantity = ToolsTable.Quantity(toolQuantity);
        fieldsValues["quantity"] = validQuantity;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validToolGroupId = ToolsTable.GroupId(toolGroupId);
        fieldsValues["group_id"] = validToolGroupId;
    }
    catch (err)
    {
        console.log(err);
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
        }
    }
    
    if (req.body.prices)
    {
        const toolPrices = req.body.prices;
        const pricesKeys = Object.keys(toolPrices);
        const fieldsValuesPrices = {};
    
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
                }
            }
    
            if (key === "toolId")
            {
                try
                {
                    const validToolId = ToolsPricesTable.ToolId(toolPrices[key]);
                    fieldsValuesPrices["tool_id"] = validToolId;
                }
                catch (err)
                {
                    console.log(err);
                }
            }
        });
        console.table(fieldsValuesPrices)
    }
});

app.post("/unit-measurement", (req, res) =>
{
    const fieldsValues = {};
    const period = req.body.period;

    try
    {
        const validPeriod = UnitMeasurementTable.Period(period);
        fieldsValues["period"] = validPeriod;
    }
    catch (err)
    {
        console.log(err);
    }

});

app.post("/tools-prices", (req, res) =>
{
    const toolId = req.body.toolId;
    const unit = req.body.unit;
    const unitMeasurementId = req.body.unitMeasurementId;
    const upToAmountOfTools = req.body.upToAmountOfTools;
    const begginingTerm = req.body.begginingTerm;
    const endTerm = req.body.endTerm;
    const price = req.body.price;
    const fieldsValuesPrices = {};

    try
    {
        const validToolId = ToolsPricesTable.ToolId(toolId);
        fieldsValuesPrices["tool_id"] = validToolId;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validUnit = ToolsPricesTable.Unit(unit);
        fieldsValuesPrices["unit"] = validUnit;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validUnitMeasurementId = ToolsPricesTable.UnitMeasurementId(unitMeasurementId);
        fieldsValuesPrices["unit_measurement_id"] = validUnitMeasurementId;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validAmountOfTools = ToolsPricesTable.UpToAmountOfTools(upToAmountOfTools);
        fieldsValuesPrices["amountOfTools"] = validAmountOfTools;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validBegginingTerm = ToolsPricesTable.BegginingTerm(begginingTerm);
        fieldsValuesPrices["begginingTerm"] = validBegginingTerm;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validEndTerm = ToolsPricesTable.EndTerm(endTerm);
        fieldsValuesPrices["endTerm"] = validEndTerm;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validPrice = ToolsPricesTable.Price(price);
        fieldsValuesPrices["price"] = validPrice;
    }
    catch (err)
    {
        console.error(err);
    }
});

app.post("/office", (req, res) =>
{
    const officeName = req.body.officeName;
    const officeSalary = req.body.officeSalary;
    const fieldsValues = {};

    try
    {
        const validOfficeName = OfficeTable.Name(officeName);
        fieldsValues["name"] = validOfficeName;
    }
    catch (err)
    {
        console.log(err);
    }

    try
    {
        const validOfficeSalary = OfficeTable.Salary(officeSalary);
        fieldsValues["salary"] = validOfficeSalary;
    }
    catch (err)
    {
        console.log(err);
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
        }
    }
});

// ---------------------------------------- PUT
app.put("/clients", async (req, res) =>
{
    const clientId = req.body.clientId;
    const fieldsValues = {};

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
        }

    }

    console.table(fieldsValues);


});

app.put("/employees", async (req, res) =>
{
    const employeeId = req.body.employeeId;
    const fieldsValues = {};

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
        }
    }
});

app.put("/tools-groups", (req, res) =>
{
    const groupId = req.body.groupId;
    const fieldsValues = {};

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
        }
    }
});

app.put("/tools", (req, res) =>
{
    const toolId = req.body.toolId;
    const fieldsValues = {};

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
        }
    }

    if (req.body.toolQuantity)
    {
        try
        {
            const toolQuantity = req.body.toolQuantity;
            const validQuantity = ToolsTable.Quantity(toolQuantity);

            fieldsValues["quantity"] = validQuantity;
        }
        catch (err)
        {
            console.log(err);
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
        }
    }

});

app.put("/unit-measurement", (req, res) =>
{
    const id = req.body.id;
    const fieldsValues = {};
    
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
        }
    }
});

app.put("/tools-prices", (req, res) =>
{
    const id = req.body.id;
    const fieldsValues = {};

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
        }
    }

    if (req.body.upToAmountOfTools)
    {
        try
        {
            const upToAmountOfTools = req.body.upToAmountOfTools;
            const validAmountOfTools = ToolsPricesTable.UpToAmountOfTools(upToAmountOfTools);

            fieldsValues["amountOfTools"] = validAmountOfTools;
        }
        catch (err)
        {
            console.log(err);
        }
    }

    if (req.body.begginingTerm)
    {
        try
        {
            const begginingTerm = req.body.begginingTerm;
            const validBegginingTerm = ToolsPricesTable.BegginingTerm(begginingTerm);
            fieldsValues["begginingTerm"] = validBegginingTerm;
        }
        catch (err)
        {
            console.log(err);
        }
    }

    if (req.body.endTerm)
    {
        try
        {
            const endTerm = req.body.endTerm;
            const validEndTerm = ToolsPricesTable.EndTerm(endTerm);
            fieldsValues["endTerm"] = validEndTerm;
        }
        catch (err)
        {
            console.log(err);
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
        }
    }
});

app.put("/tools-managment", (req, res) =>
{
    const toolId = req.body.toolId;

    try
    {
        if (req.body.available)
        {

        }
    }
    catch (err)
    {
        console.log(err);
    }
});

app.put("/office", (req, res) =>
{
    const officeId = req.body.officeId;
    const fieldsValues = {};

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
        }
    }
});

// ---------------------------------------- DELETE
app.delete("/clients", (req, res) =>
{
    const clientId = req.body.clientId;
});

app.delete("/employees", (req, res) =>
{
    const employeeId = req.body.employeeId;
});

app.delete("/tools-groups", (req, res) =>
{
    const groupId = req.body.groupId;
});

app.delete("/tools", (req, res) =>
{
    const toolId = req.body.toolId;
});

app.delete("/unit-measurement", (req, res) =>
{
    const unitMeasurementId = req.body.unitMeasurementId;
});

app.delete("/tools-prices", (req, res) =>
{
    const toolPricesId = req.body.toolPricesId;
});

app.delete("/office", (req, res) =>
{
    const officeId = req.body.officeId;
});

app.get("/teste", async (req, res) =>
{
    // const result = await Query.Update("users", ["last_name"], ["guilherme"], ["*"], ["id ="], ["2"], [""]);
    // const result = await Query.Select("users", ["*"], [""], [""], [""], ["name"]);
    const result = await Query.Insert("users", {"age": 2, "name": "noah"}, ["*"]);
    // const result = await Query.Select("users", ["name", "last_name"],["id ="], ["2"], [""]);

    console.table(result.data);
    res.send(result);
});

app.listen(port);