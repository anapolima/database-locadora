class TableTools
{
    #tool_name
    #tool_description
    #tool_quantity
    #tool_group_id
    #id
    
    constructor ()
    {
        this.#id = undefined;
        this.#tool_name = undefined;
        this.#tool_description = undefined;
        this.#tool_quantity = undefined;
        this.#tool_group_id = undefined;
    }

    Id (_id)
    {
        return this.#verify_id(_id);
    }

    #verify_id = (_id) =>
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
                    this.#id = Number(trimmed);

                    return this.#id;
                }
                else
                {
                    throw new Error(`The id must be a number, positive and non-zero, for example "5"`);
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

    Name (_name)
    {
        return this.#verify_tool_name(_name);
    }

    #verify_tool_name = ( _name) => 
    {
        const tool_name = _name;

        if (typeof (tool_name) === "string")
        {
            if (tool_name.trim())
            {
                if (tool_name.trim().length <= 80 && tool_name.trim().length > 0)
                {
                    this.#tool_name = tool_name.toUpperCase().trim();
    
                    return this.#tool_name;
                }
                else
                {
                    throw new Error("The tool name must be greater than 1 character and less than or equal to 80 characters");
                }
            }
            else
            {
                throw new Error("The tool name can not be only spaces characters");
            }
        }
        else
        {
            throw new Error("Tool name must be a string");
        }
    }

    Description (_description)
    {
        return this.#verify_tool_description(_description);
    }

    #verify_tool_description = ( _description) =>
    {
        const tool_description = _description;

        if (typeof (tool_description) === "string")
        {
            if (tool_description.trim())
            {
                if (tool_description.trim().length <= 140 && tool_description.trim().length > 0)
                {
                    this.#tool_description = tool_description.toUpperCase().trim();

                    return this.#tool_description;
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

    Quantity (_quantity)
    {
        return this.#verify_tool_quantity(_quantity);
    }

    #verify_tool_quantity = (_quantity) =>
    {
        const tool_quantity = _quantity;

        if (typeof (tool_quantity) === "string")
        {
            const eIndex = tool_quantity.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = tool_quantity.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) !== 0 && Number(trimmed) > 0)
                {
                    this.#tool_quantity = Number(trimmed);

                    return this.#tool_quantity;
                }
                else
                {
                    throw new Error(`The tool quantity must be a number, positive and non-zero, for example "5"`);
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

    GroupId (_id)
    {
        return this.#verify_group_id(_id);
    }

    #verify_group_id = (_id) =>
    {
        const group_id = _id;

        if (typeof (group_id) === "string")
        {
            const eIndex = group_id.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = group_id.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) > 0)
                {
                    this.#tool_group_id = Number(trimmed);

                    return this.#tool_group_id;
                }
                else
                {
                    throw new Error(`The group id must be a number, positive and non-zero, for example "5"`);
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
}

const ToolsTable = new TableTools();

export default ToolsTable;
