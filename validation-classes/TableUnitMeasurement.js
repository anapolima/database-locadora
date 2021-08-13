class TableUnitMeasurement
{
    #period

    constructor ()
    {
        this.#period = undefined;
    }

    Period (_period)
    {
        return this.#verify_period(_period);
    }

    #verify_period = (_period) =>
    {
        const period = _period;

        if (typeof (period) === "string" && period.trim().lengh <= 9 && period.trim().length >= 3)
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