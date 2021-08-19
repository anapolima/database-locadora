class TableToolsManagment
{
    #id
    #tool_id
    #available
    #rented
    #total

    constructor ()
    {
        this.#id;
        this.#tool_id = undefined;
        this.#available = undefined;
        this.#rented = undefined;
        this.#total = undefined;
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

    Total (_total)
    {
        return this.#verify_total(_total);
    }

    #verify_total = (_total) =>
    {
        const total = _total;

        if (typeof (total) === "string")
        {
            const eIndex = total.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = total.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) > 0)
                {
                    this.#total = Number(trimmed);

                    return this.#total;
                }
                else
                {
                    throw new Error(`The total must be a number, positive and non-zero, for example "5"`);
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

    Available (_available)
    {
        return this.#verify_available(_available);
    }

    #verify_available = (_available) =>
    {
        const available = _available;

        if (typeof (available) === "string")
        {
            const eIndex = available.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = available.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) >= 0 && Number(trimmed) <= this.#total)
                {
                    this.#available = Number(trimmed);

                    return this.#available;
                }
                else
                {
                    throw new Error(`The available must be a number, positive and smaller than the total. The provided total is ${this.#total}.`);
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

    Rented (_rented)
    {
        return this.#verify_rented(_rented);
    }

    #verify_rented = (_rented) =>
    {
        const rented = _rented;

        if (typeof (rented) === "string")
        {
            const eIndex = rented.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = rented.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) >= 0 && Number(trimmed) <= this.#total && Number(trimmed) + this.#available === this.#total)
                {
                    this.#rented = Number(trimmed);

                    return this.#rented;
                }
                else
                {
                    throw new Error(`The rented must be a number, positive and smaller than the total and available + rented must be equal to the total. The provided total is ${this.#total}, the provided available is ${this.#available}.`);
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

const ToolsManagmentTable = new TableToolsManagment();

export default ToolsManagmentTable;