class TableToolsPrices
{
    #tool_id
    #unit
    #unit_measurement_id
    #up_to_amount_of_tools
    #beggining_term
    #end_of_term
    #price

    constructor ()
    {
        this.#tool_id = undefined;
        this.#unit = undefined;
        this.#unit_measurement_id = undefined;
        this.#up_to_amount_of_tools = undefined;
        this.#beggining_term = undefined;
        this.#end_of_term = undefined;
        this.#price = undefined;
    }

    ToolId(_id)
    {
        return this.#verify_tool_id(_id);
    }

    #verify_tool_id = (_id) =>
    {
        const tool_id = _id;

        if (typeof (tool_id) === "string")
        {
            const eIndex = tool_id.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = tool_id.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) !== 0 && Number(trimmed) > 0)
                {
                    this.#tool_id = Number(trimmed);

                    return this.#tool_id;
                }
                else
                {
                    throw new Error(`The tool id must be a number, positive and non-zero, for example "5"`);
                }
            }
            else
            {
                throw new Error("The number string must not contain the letter E/e");
            }
        }
        else
        {
            throw new Error("You should pass numbers as a string");
        }
    }

    Unit (_unit)
    {
        return this.#verify_unit(_unit);
    }

    #verify_unit = (_unit) =>
    {
        const unit = _unit;

        if (typeof (unit) === "string")
        {
            const eIndex = unit.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = unit.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) > 0)
                {
                    this.#unit = Number(trimmed);

                    return this.#unit;
                }
                else
                {
                    throw new Error(`The unit must be a number, positive and non-zero, for example "5"`);
                }
            }
            else
            {
                throw new Error("The number string must not contain the letter E/e");
            }
        }
        else
        {
            throw new Error("You should pass numbers as a string");
        }
    }

    UnitMeasurementId (_id)
    {
        return this.#verify_unit_measurement_id(_id);
    }

    #verify_unit_measurement_id = (_id) =>
    {
        const id = _id;

        if (typeof (id) === "string")
        {
            const eIndex = id.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = id.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) > 0)
                {
                    this.#unit_measurement_id = Number(trimmed);

                    return this.#unit_measurement_id;
                }
                else
                {
                    throw new Error(`The unit measurement id must be a number, positive and non-zero, for example "5"`);
                }
            }
            else
            {
                throw new Error("The number string must not contain the letter E/e");
            }
        }
        else
        {
            throw new Error("You should pass numbers as a string");
        }
    }

    UpToAmountOfTools (_amount)
    {
        return this.#verify_amount(_amount);
    }

    #verify_amount = (_amount) =>
    {
        const amount = _amount;

        if (typeof (amount) === "string")
        {
            const eIndex = amount.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = amount.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) > 0)
                {
                    this.#up_to_amount_of_tools = Number(trimmed);

                    return this.#up_to_amount_of_tools;
                }
                else
                {
                    throw new Error(`The amount must be a number, positive and non-zero, for example "5"`);
                }
            }
            else
            {
                throw new Error("The number string must not contain the letter E/e");
            }
        }
        else
        {
            throw new Error("You should pass numbers as a string");
        }
    }

    Price (_price)
    {
        return this.#verify_price(_price);
    }

    #verify_price = (_price) =>
    {
        const price = _price.trim();

        const eIndex = price.toLowerCase().indexOf("e");

        if (eIndex === -1)
        {
            const regex = /[\d]{1,3},[\d]{2}$/;

            if (regex.test(price))
            {
                const numericPrice = Number(price.replace(",", "."));

                this.#price = numericPrice;

                return this.#price
            }

        }
        else
        {
            throw new Error("The price string must not contain the letter E/e")
        }
    }

    BegginingTerm(_date)
    {
        return this.#verify_beggining_term(_date);
    }

    #verify_beggining_term = (_date) =>
    {
        const date = _date.trim();
        const regex = /\d{2}\/\d{2}\/\d{4}$/;

        if (regex.test(date))
        {
            if (this.#validate_date(date))
            {
                const splitedDate = date.split("/");

                const day = splitedDate[0];
                const month = splitedDate[1];
                const year = splitedDate[2];

                const formatedDate = `${year}-${month}-${day}`;

                this.#beggining_term = formatedDate;

                return this.#beggining_term;
            }
            else
            {
                throw new Error("Invalid date")
            }
        }
        else
        {
            throw new Error("The date string must be on the format DD/MM/YYYY")
        }
    }

    EndTerm (_date)
    {
        return this.#verify_end_term(_date);
    }

    #verify_end_term = (_date) =>
    {
        const date = _date.trim();
        const regex = /\d{2}\/\d{2}\/\d{4}$/;

        if (regex.test(date))
        {
            if (this.#validate_date(date))
            {
                const splitedDate = date.split("/");

                const day = splitedDate[0];
                const month = splitedDate[1];
                const year = splitedDate[2];

                const formatedDate = `${year}-${month}-${day}`;

                if (new Date(formatedDate) - new Date(this.#beggining_term) > 0)
                {
                    this.#end_of_term = formatedDate;

                    return this.#end_of_term;
                }
                else
                {
                    throw new Error(`The expiration date must be bigger than or equal to the begginig date. The provided begginig date is ${this.#beggining_term}`); 
                }
            }
            else
            {
                throw new Error("Invalid date")
            }
        }
        else
        {
            throw new Error("The date string must be on the format DD/MM/YYYY")
        }
    }

    #validate_date = (_date) =>
    {
        const date = _date.split("/");

        const day = Number(date[0]);
        const month = Number(date[1]);
        const year = Number(date[2]);

        switch (month)
        {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                if (day > 31 || day < 1)
                {
                    return false;
                }
                else
                {
                    return true;
                }
        
            case 4:
            case 6:
            case 9:
            case 11:
                if (day > 30 || day < 1)
                {
                    return false;
                }
                else
                {
                    return true;
                }
        
            case 2:
                if( ( year % 4 == 0 && year % 100 != 0 ) || ( year % 400 == 0)  )
                {
                    if (day > 29 || day < 1)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }    
                }
                else
                {
                    if (day > 28 || day < 1)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }    
                }
            
            default:
                return false;
        }
    }
}

const ToolsPricesTable = new TableToolsPrices();

export default ToolsPricesTable;