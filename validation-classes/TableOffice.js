class TableOffice
{
    #officeName
    #officeDescription
    #officeSalary
    
    constructor ()
    {
        this.#officeName = undefined;
        this.#officeDescription = undefined;
        this.#officeSalary = undefined;
    }

    Name (_name)
    {
        return this.#verify_officeName(_name);
    }

    #verify_officeName = ( _name) => 
    {
        const officeName = _name;

        if (typeof (officeName) === "string")
        {
            if (officeName.trim())
            {
                if (officeName.trim().length <= 20 && officeName.trim().length > 0)
                {
                    this.#officeName = officeName.toUpperCase().trim();
    
                    return this.#officeName;
                }
                else
                {
                    throw new Error("The office name must be greater than 1 character and less than or equal to 80 characters");
                }
            }
            else
            {
                throw new Error("The office name can not be only spaces characters");
            }
        }
        else
        {
            throw new Error("Tool name must be a string");
        }
    }

    Description (_description)
    {
        return this.#verify_office_description(_description);
    }

    #verify_office_description = ( _description) =>
    {
        const officeDescription = _description;

        if (typeof (officeDescription) === "string")
        {
            if (officeDescription.trim())
            {
                if (officeDescription.trim().length <= 140 && officeDescription.trim().length > 0)
                {
                    this.#officeDescription = officeDescription.toUpperCase().trim();

                    return this.#officeDescription;
                }
                else
                {
                    throw new Error ("When providing a tool description, it must be greater than 1 character and less than or equal to 140 characters");
                }
            }
            else
            {
                throw new Error("When providing a tool description, it must not be only spaces characters");
            }
        }
        else
        {
            throw new Error("The tool description must be a string");
        }
    }

    Salary (_salary)
    {
        return this.#verify_office_salary(_salary);
    }

    #verify_office_salary = (_salary) =>
    {
        const officeSalary = _salary.trim();

        const eIndex = officeSalary.toLowerCase().indexOf("e");

        if (eIndex === -1)
        {
            const regex = /[\d],[\d]{2}$/;

            if (regex.test(officeSalary) && Number(officeSalary.replace(",", ".") > 0))
            {
                const numericSalary = Number(officeSalary.replace(",", "."));

                this.#officeSalary = numericSalary;

                return this.#officeSalary
            }
            else
            {
                throw new Error("The office salary must be in the format XX,XX and be bigger than 0");
            }

        }
        else
        {
            throw new Error("The office salary string must not contain the letter E/e")
        }
    }
}

const OfficeTable = new TableOffice();

export default OfficeTable;
