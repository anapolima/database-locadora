import pg from "pg";
import dotenv from "dotenv";

class QueryGenerator
{
    #columns
    #params
    #returning
    #client
    #whereParams
    #whereColumns
    #join
    #orderBy
    #result
    #query

    constructor ()
    {
        this.#query = "";
        this.#columns = "";
        this.#params = "";
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};
    }

    #SetClient = () =>
    {
        dotenv.config();

        this.#client = new pg.Client({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
    }

    Insert (_beginTransaction, _table, _columnsValues, _returning)
    {
        this.#SetClient();
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};
        const table = _table;
        const columnsValues = _columnsValues;
        const returning = _returning;
        const beginTransaction = _beginTransaction;

        if (columnsValues instanceof Object && !(columnsValues instanceof Array))
        {
            const columns = Object.keys(columnsValues);
            this.#columns = columns.join(", ");
            const params = [];
            const values = [];

            for (let i = 0; i < columns.length; i++)
            {
                params.push(`$${i + 1}`);
            }

            columns.forEach( (column) =>
            {
                values.push(columnsValues[column]);
            });

            this.#params = params.join(", ");

            if (returning)
            {
                if (Array.isArray(returning))
                {
                    this.#returning = returning.join(", ");
                }
                else
                {
                    this.#result.error.params = "Returning must be an array";
                    return this.#result;
                }
            }

            if (beginTransaction)
            {
                if (typeof (beginTransaction) === "boolean")
                {                
                    const result = this.#client.connect()
                        .then( () => this.#client.query("BEGIN;"))
                        .then( () => this.#client.query(`INSERT INTO ${table} (${this.#columns}) VALUES (${this.#params}) ${returning ? `RETURNING ${this.#returning}` : ""}`, values))
                        .then( async (result) =>
                        {
                            this.#result.data = result.rows;
        
                            await this.#client.query("COMMIT")
                                .then( () => console.log("COMMIT SUCCESSFUL"))
                                .catch( (err) => this.#result.error.commit = err);
                            return this.#result
                        })
                        .catch( async (err) =>
                        {
                            this.#result.error.transaction = err.message;
        
                            await this.#client.query("ROLLBACK")
                                .then( () => console.log("ROLLBACK SUCCESSFUL"))
                                .catch( (err) => this.#result.error.rollback = err);
                            return this.#result;
                        })
                        .finally( () =>
                        {
                            this.#client.end();
                            this.#columns = "";
                            this.#params = "";
                            this.#returning = "";
                            this.#whereParams = "";
                            this.#whereColumns = "";
                            this.#orderBy = "";
                        });
                    return result;
                }
                else
                {
                    this.#result.error.params = "The begin transaction must be a boolean value";
                    return this.#result
                }
            }
            else
            {
                const result = this.#client.connect()
                    .then( () => this.#client.query(`INSERT INTO ${table} (${this.#columns}) VALUES (${this.#params}) ${returning ? `RETURNING ${this.#returning}` : ""}`, values))
                    .then( (result) =>
                    {
                        this.#result.data = result.rows;
                        return this.#result
                    })
                    .catch( (err) =>
                    {
                        this.#result.error.transaction = err.message;
                        return this.#result;
                    })
                    .finally( () =>
                    {
                        this.#client.end();
                        this.#columns = "";
                        this.#params = "";
                        this.#returning = "";
                        this.#whereParams = "";
                        this.#whereColumns = "";
                        this.#orderBy = "";
                    });
                return result;
            }
        }
        else
        {
            this.#result.error.params = "Columns and values must be arrays";
            return this.#result;
        }
        
    }

    Select(_table, _columns, _whereColumnsValues, _logicalOperators, _orderBy, _join)
    {
        this.#SetClient();
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};
        const table = _table;
        const columns = _columns;
        const whereColumnsValues = _whereColumnsValues;
        const logicalOperators = _logicalOperators;
        const whereColumns = [];
        const values = [];
        const orderBy = _orderBy;
        const join = _join;

        if (Array.isArray(columns))
        {
            this.#columns = columns.join(", ");

            let param = 1;

            if ( ( whereColumnsValues instanceof Object && !(whereColumnsValues instanceof Array) ) && Array.isArray(logicalOperators))
            {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(", ");
                const whereParams = [];
    
                if (whereColumns.length !== 0)
                {
                    whereColumns.forEach( (_column, _index) =>
                    {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$|in$|not in$/i;

                        const operator = whereColumnsValues[_column].operator;
                        const isValidOperator = regex.test(operator)

                        if (isValidOperator)
                        { 
                            if (operator.toLowerCase() === "like" || operator.toLowerCase() === "not like")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} '%'||$${param}||'%'  ${(logicalOperators[_index] ? logicalOperators[_index] : "")}`);
                                values.push(whereColumnsValues[_column].value);
                                param ++;
                            }
                            else if (operator.toLowerCase() === "between" || operator.toLowerCase() === "not between")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} $${param} AND $${param + 1} ${(logicalOperators[_index] ? logicalOperators[_index] : "")}`);
                                values.push(whereColumnsValues[_column].value[0], whereColumnsValues[_column].value[1]);
                                param += 2;
                            }
                            else if (operator.toLowerCase() === "is" || operator.toLowerCase() === "is not")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} ${whereColumnsValues[_column].value} ${(logicalOperators[_index] ? logicalOperators[_index] : ";")}`);
                            }
                            else if (operator.toLowerCase() === "in" || operator.toLowerCase() === "not in")
                            {
                                let inValues = null;

                                whereColumnsValues[_column].value.forEach((_value, _index) =>
                                {
                                    if (_index === 0)
                                    {
                                        inValues = `(${whereColumnsValues[_column].value[_index]}`;
                                    }
                                    else
                                    {
                                        inValues += `, ${whereColumnsValues[_column].value[_index]}`;
                                    }

                                    if (_index === whereColumnsValues[_column].value.length - 1)
                                    {
                                        inValues += ')';
                                    }
                                });
                                whereParams.push(`${_column} ${operator.toUpperCase()} ${inValues} ${(logicalOperators[_index] ? logicalOperators[_index] : "")}`);
                            }
                            else
                            {
                                if (isNaN(whereColumnsValues[_column].value))
                                {
                                    whereParams.push(`${_column} ${operator.toUpperCase()} ${whereColumnsValues[_column].value} ${(logicalOperators[_index] ? logicalOperators[_index] : "")}`);
                                }
                                else
                                {
                                    whereParams.push(`${_column} ${operator.toUpperCase()} $${param} ${(logicalOperators[_index] ? logicalOperators[_index] : "")}`);
                                    values.push(whereColumnsValues[_column].value);
                                    param++;
                                }
                            }
                        }
                        else
                        {
                            this.#result.error.params = "Invalid operator on WHERE params";
                            return this.#result;
                        }

                    });
                    this.#whereParams = whereParams.join(" ");
                }
            }

            if (join)
            {
                if (( join instanceof Object && !(join instanceof Array) ))
                {
                    const tables = Object.keys(join);
                    const regexJoin = /join$|inner join$|left join$|right join$|full outer join$/;
                    const regexOperator = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$|in$|not in$/i;
                    const whereJoinParams = [];
    
                    tables.forEach( (_table, _indexTable) =>
                    {
                        const table = join[_table];

                        if (( table instanceof Object && !(table instanceof Array) ))
                        {
                            const tableJoin = join[_table].join;
                            const isValidJoin = regexJoin.test(tableJoin);
        
                            if (isValidJoin)
                            {
                                const whereJoin =  {...join[_table].on};
                                const whereJoinColumns = Object.keys(whereJoin);
                                
                                whereJoinParams.push(`${tableJoin.toUpperCase()} ${_table} ON`);
                                whereJoinColumns.forEach( (_column, _indexColumn) =>
                                {
                                    const operator = whereJoin[_column].operator;
                                    const isValidOperator = regexOperator.test(operator);
                                    
                                    if (isValidOperator)
                                    {
                                        // whereJoinParams.push(`${tableJoin.toUpperCase()} ${_table} WHERE ${_table}.${_column} ${operator} ${param}`);
                                        const value = whereJoin[_column].value;
        
                                        if (operator.toLowerCase() === "like" || operator.toLowerCase() === "not like")
                                        {
                                            whereJoinParams.push(
                                                `
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     '%'||$${param}||'%' 
        
                                                ${
                                                      join[_table].logicalOperators[_indexColumn] 
                                                    ? join[_table].logicalOperators[_indexColumn] 
                                                    : ""
                                                }
                                            `);
                                            values.push(value);
                                            param ++;
                                        }
                                        else if (operator.toLowerCase() === "between" || operator.toLowerCase() === "not between")
                                        {
                                            whereJoinParams.push(
                                                `
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     $${param} AND $${param + 1} 
                                                ${
                                                      join[_table].logicalOperators[_indexColumn] 
                                                    ? join[_table].logicalOperators[_indexColumn] 
                                                    : ""
                                                }`
                                            );
                                            values.push(value[0], value[1]);
                                            param += 2;
                                        }
                                        else if (operator.toLowerCase() === "is" || operator.toLowerCase() === "is not")
                                        {
                                            whereJoinParams.push(`${_table}.${_column} ${operator.toUpperCase()}
                                                ${value} 
                                                ${
                                                      join[_table].logicalOperators[_indexColumn]
                                                    ? join[_table].logicalOperators[_indexColumn]
                                                    : ""
                                                }`);
                                        }
                                        else if (operator.toLowerCase() === "in" || operator.toLowerCase() === "not in")
                                        {
                                            let inValues = null;
            
                                            value.forEach((_value, _index) =>
                                            {
                                                if (_index === 0)
                                                {
                                                    inValues = `(${value[_index]}`;
                                                }
                                                else
                                                {
                                                    inValues += `, ${value[_index]}`;
                                                }
            
                                                if (_index === value.length - 1)
                                                {
                                                    inValues += ')';
                                                }
                                            });
                                            whereJoinParams.push(
                                                `
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     ${inValues} 
                                                ${
                                                      join[_table].logicalOperators[_indexColumn]
                                                    ? join[_table].logicalOperators[_indexColumn]
                                                    : ""
                                                }`
                                            );
                                        }
                                        else
                                        {
                                            if (isNaN(value))
                                            {
                                                whereJoinParams.push(
                                                    `
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     ${value} 
                                                    ${
                                                          join[_table].logicalOperators[_indexColumn]
                                                        ? join[_table].logicalOperators[_indexColumn]
                                                        : ""
                                                    }`
                                                )
                                            }
                                            else
                                            {
                                                whereJoinParams.push(
                                                    `
                                                    ${_table}.${_column} ${operator.toUpperCase()}
                                                     $${param} 
                                                    ${
                                                          join[_table].logicalOperators[_indexColumn]
                                                        ? join[_table].logicalOperators[_indexColumn]
                                                        : ""
                                                    }`
                                                );
                                                values.push(value);
                                                param++;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        this.#result.error.params = "Invalid operator on JOIN WHERE params";
                                        return this.#result;
                                    }
                                })
                            }
                            else
                            {
                                this.#result.error.params = "Invalid join type";
                                return this.#result;
                            }
                        }
                        else
                        {
                            this.#result.error.params = "The table to join must be an JSON containing a 'join' key that must be a string indicating the join type. A 'where' key that must be a JSON, and a 'logicalOperators' key that must be an array";
                            return this.#result;
                        }
                    });

                    this.#join = whereJoinParams.join(" ");
                }
                else
                {
                    this.#result.error.params = "The join must be an JSON. Each key must be the name of the table to join";
                    return this.#result;
                }
            }

            if (orderBy)
            {
                if (Array.isArray(orderBy))
                {
                    this.#orderBy = orderBy.join(", ");
                }
            }

            const result = this.#client.connect()
                .then( () => console.log(
                    `SELECT ${this.#columns} FROM ${table} ${join ? this.#join : ""} ${whereColumns.length !== 0 ? `WHERE ${this.#whereParams}` : ""} ${orderBy && orderBy.length > 0 ? `ORDER BY ${this.#orderBy}` : ""}`
                ))
                .then( () => this.#client.query(`SELECT ${this.#columns} FROM ${table} ${this.#join ? this.#join : ""} ${ whereColumns.length !== 0 ? `WHERE ${this.#whereParams}` : ""} ${orderBy && orderBy.length > 0 ? `ORDER BY ${this.#orderBy}` : ""}`, values))
                .then( (result) =>
                {
                    this.#result.data = result.rows;
                    return this.#result;
                })
                .catch( (err) => this.#result.transaction = err.message)
                .finally( () =>
                {
                    this.#client.end();
                    this.#columns = "";
                    this.#join = "";
                    this.#params = "";
                    this.#returning = "";
                    this.#whereParams = "";
                    this.#whereColumns = "";
                    this.#orderBy = "";
                });
            
            return result;
        }
        else
        {
            this.#result.error.params = "Columns, values and logical operators must be arrays"
            return this.#result;
        }
    }

    Update (_beginTransaction, _table, _columnsValues, _returning, _whereColumnsValues, _logicalOperators)
    {
        this.#SetClient();
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};
        const table = _table;
        const values = [];
        const columnsValues = _columnsValues;
        const columns = []
        const returning = _returning;
        const whereColumnsValues = _whereColumnsValues;
        const whereColumns = [];
        const logicalOperators = _logicalOperators;
        const beginTransaction = _beginTransaction;

        if (columnsValues instanceof Object && !(columnsValues instanceof Array))
        {
            columns.push(...Object.keys(columnsValues));
            this.#columns = columns.join(", ");
            const params = [];

            let param = 1;

            columns.forEach( (_column) =>
            {
                params.push(`${_column} = $${param}`);
                values.push(columnsValues[_column]);
                param++;
            });

            this.#params = params.join(", ");

            if (returning)
            {
                if (Array.isArray(returning))
                {
                    this.#returning = returning.join(", ");
                }
                else
                {
                    this.#result.error.params = "Returning must be an array";
                    return this.#result;
                }
            }

            if ( ( whereColumnsValues instanceof Object && !(whereColumnsValues instanceof Array) ) && Array.isArray(logicalOperators))
            {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(", ");
                const whereParams = [];
    
                if (whereColumns.length !== 0)
                {
                    whereColumns.forEach( (_column, _index) =>
                    {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$|in$|not in$/i;

                        const operator = whereColumnsValues[_column].operator;
                        const isValidOperator = regex.test(operator)

                        if (isValidOperator)
                        { 
                            if (operator.toLowerCase() === "like" || operator.toLowerCase() === "not like")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} '%'||$${param}||'%' `);
                                values.push(whereColumnsValues[_column].value);
                                param ++;
                            }
                            else if (operator.toLowerCase() === "between" || operator.toLowerCase() === "not between")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} $${param} AND $${param + 1} ` + (logicalOperators[_index] ? logicalOperators[_index] : ""));
                                values.push(whereColumnsValues[_column].value[0], whereColumnsValues[_column].value[1]);
                                param += 2;
                            }
                            else if (operator.toLowerCase() === "is" || operator.toLowerCase() === "is not")
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} ${whereColumnsValues[_column].value} ` + (logicalOperators[_index] ? logicalOperators[_index] : ""));
                            }
                            else if (operator.toLowerCase() === "in" || operator.toLowerCase() === "not in")
                            {
                                let inValues = null;

                                whereColumnsValues[_column].value.forEach((_value, _index) =>
                                {
                                    if (_index === 0)
                                    {
                                        inValues = `(${whereColumnsValues[_column].value[_index]}`;
                                    }
                                    else
                                    {
                                        inValues += `, ${whereColumnsValues[_column].value[_index]}`;
                                    }

                                    if (_index === whereColumnsValues[_column].value.length - 1)
                                    {
                                        inValues += ')';
                                    }
                                });
                                whereParams.push(`${_column} ${operator.toUpperCase()} ${inValues} `  + (logicalOperators[_index] ? logicalOperators[_index] : ""));
                            }
                            else
                            {
                                whereParams.push(`${_column} ${operator.toUpperCase()} $${param} `  + (logicalOperators[_index] ? logicalOperators[_index] : ""));
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            }
                        }
                        else
                        {
                            this.#result.error.params = "Invalid operator on WHERE params";
                            return this.#result;
                        }

                    });

                    this.#whereParams = whereParams.join(" ");
                }
            }

            if (beginTransaction)
            {
                if (typeof (beginTransaction) === "boolean")
                {
                    const result = this.#client.connect()
                        .then( () => this.#client.query("BEGIN;"))
                        .then( () => this.#client.query(`UPDATE ${table} SET ${this.#params} ${whereColumns ? `WHERE ${this.#whereParams}` : ""} ${returning ? `RETURNING ${this.#returning}` : ""}`, values))
                        .then( async (result) =>
                        {
                            this.#result.data = result.rows;
                            await this.#client.query("COMMIT;")
                                .then(() => console.log("COMMIT SUCCESSFUL"))
                                .catch((err) => this.#result.error.commit = err);
        
                            return this.#result;
                        })
                        .catch( async (err) =>
                        {
                            this.#result.error.transaction = err.message;
        
                            await this.#client.query("ROLLBACK;")
                                .then(() => console.log("ROLLBACK SUCCESSFUL"))
                                .catch((err) => this.#result.error.rollback = err);
        
                            return this.#result;
                        })
                        .finally( () =>
                        {
                            this.#client.end();
                            this.#columns = "";
                            this.#params = "";
                            this.#returning = "";
                            this.#whereParams = "";
                            this.#whereColumns = "";
                            this.#orderBy = "";
                        });
                    
                    return result;
                }
                else
                {
                    this.#result.error.params = "The begin transaction must be a boolean value";
                    return this.#result
                }
            }
            else
            {
                const result = this.#client.connect()
                    .then( () => this.#client.query(`UPDATE ${table} SET ${this.#params} ${whereColumns ? `WHERE ${this.#whereParams}` : ""} ${returning ? `RETURNING ${this.#returning}` : ""}`, values))
                    .then( (result) =>
                    {
                        this.#result.data = result.rows;
                        return this.#result;
                    })
                    .catch( (err) =>
                    {
                        this.#result.error.transaction = err.message;
                        return this.#result;
                    })
                    .finally( () =>
                    {
                        this.#client.end();
                        this.#columns = "";
                        this.#params = "";
                        this.#returning = "";
                        this.#whereParams = "";
                        this.#whereColumns = "";
                        this.#orderBy = "";
                    });
                
                return result;
            }
        }
        else
        {
            this.#result.error.params = "Columns and values must be arrays";
            return this.#result;
        }
    }

    BeginTransaction ()
    {
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};
        this.#SetClient();
        this.#client.connect();
        this.#client.query("BEGIN;");
    }

    Commit ()
    {
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};

        this.#client.query("COMMIT;")
        .then( () =>
        {
            console.log("COMMIT SUCCESSFUL");
            this.#client.end();
        })
        .catch( (err) => this.#result.error.commit = err);

        return this.#result
    }

    Rollback ()
    {
        this.#result = { error: {transaction: false, commit: false, rollback: false, params: false}, data: false};

        this.#client.query("ROLLBACK;")
        .then( () =>
        {
            console.log("ROLLBACK SUCCESSFUL");
            this.#client.end();
        })
        .catch( (err) => this.#result.error.rollback = err);

        return this.#result
    }
}

const Query = new QueryGenerator();
export default Query;