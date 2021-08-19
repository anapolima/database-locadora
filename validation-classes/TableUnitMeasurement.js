class TableUnitMeasurement
{
    #id
    #period

    constructor ()
    {
        this.#id = undefined;
        this.#period = undefined;
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

    Period (_period)
    {
        return this.#verify_period(_period);
    }

    #verify_period = (_period) =>
    {
        const period = _period;

        if (typeof (period) === "string" && period.trim().length <= 9 && period.trim().length >= 3)
        {
            this.#period = period.toUpperCase().trim();

            return this.#period;
        }
        else
        {
            throw new Error("Period must be a string with at least 3 characters and smaller than or equal to 9 characters");
        }
    }
}

const UnitMeasurementTable = new TableUnitMeasurement();

export default UnitMeasurementTable;