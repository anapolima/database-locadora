class TableToolsGroups
{
    #id
    #group_name
    #group_description

    constructor ()
    {
        this.#id = undefined;
        this.#group_name = undefined;
        this.#group_description = undefined;
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
        return this.#verify_group_name(_name);
    }

    #verify_group_name = (_name) =>
    {
        const group_name = _name;

        if (typeof (group_name) === "string")
        {
            if (group_name.trim())
            {
                if (group_name.trim().length <= 30 && group_name.trim().length > 0)
                {
                    this.#group_name = group_name.toUpperCase().trim();
    
                    return this.#group_name;
                }
                else
                {
                    throw new Error("The group name must be greater than 1 character and less than or equal to 30 characters");
                }
            }
            else
            {
                throw new Error("The group name can not be only spaces characters");
            }
        }
        else
        {
            throw new Error("Group name must be a string");
        }
    }

    Description (_description)
    {
        return this.#verify_group_description(_description);
    }

    #verify_group_description = (_description) =>
    {
        const group_description = _description;

        if (typeof (group_description) === "string")
        {
            if (group_description.trim())
            {
                if (group_description.trim().length <= 140 && group_description.trim().length > 0)
                {
                    this.#group_description = group_description.toUpperCase().trim();

                    return this.#group_description;
                }
                else
                {
                    throw new Error ("When providing a group description, it must be greater than 1 character and less than or equal to 140 characters");
                }
            }
            else
            {
                throw new Error("When providing a group description, it must not be only spaces characters");
            }
        }
        else
        {
            throw new Error("The group description must be a string");
        }
    }
}

const ToolsGroupsTable = new TableToolsGroups();

export default ToolsGroupsTable;
