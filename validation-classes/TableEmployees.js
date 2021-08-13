class TableEmployees
{
    #office_id
    #first_name
    #last_name
    #phone_ddi
    #phone_ddd
    #phone_number
    #city
    #state
    #address
    #cpf
    #username
    #password

    constructor ()
    {
        this.#office_id = undefined;
        this.#first_name = undefined;
        this.#last_name = undefined;
        this.#phone_ddi = undefined;
        this.#phone_ddd = undefined;
        this.#phone_number = undefined;
        this.#city = undefined;
        this.#state = undefined;
        this.#address = undefined;
        this.#cpf = undefined;
        this.#username = undefined;
        this.#password = undefined;
    }

    OfficeId (_id)
    {
       return this.#verify_office_id(_id);
    }

    #verify_office_id = (_id) =>
    {
        const office_id = _id;

        if (typeof (office_id) === "string")
        {
            const eIndex = office_id.toLowerCase().indexOf("e");

            if (eIndex === -1)
            {
                const trimmed = office_id.trim();

                if (!isNaN(Number(trimmed)) && Number(trimmed) !== 0 && Number(trimmed) > 0)
                {
                    this.#office_id = Number(trimmed);

                    return this.#office_id;
                }
                else
                {
                    throw new Error(`The office id must be a number, positive and non-zero, for example "5"`);
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

    FirstName (_first_name)
    {
        return this.#verify_first_name(_first_name);
    }

    #verify_first_name = (_first_name) =>
    {
        const first_name = _first_name;

        if (typeof (first_name) === "string")
        {
            if (first_name.trim())
            {
                if (first_name.trim().length <= 50 && first_name.trim().length > 0)
                {
                    this.#first_name = first_name.toUpperCase().trim();
    
                    return this.#first_name;
                }
                else
                {
                    throw new Error("The first name must be greater than 1 character and less than or equal to 50 characters");
                }
            }
            else
            {
                throw new Error("The first name can not be only spaces characters");
            }
        }
        else
        {
            throw new Error("First name must be a string");
        }
    }

    LastName (_last_name)
    {
        return this.#verify_last_name(_last_name);
    }

    #verify_last_name = (_last_name) =>
    {
        const last_name = _last_name;

        if (typeof (last_name) === "string")
        {
            if (last_name.trim())
            {
                if (last_name.trim().length <= 50 && last_name.trim().length > 0)
                {
                    this.#last_name = last_name.toUpperCase().trim();
    
                    return this.#last_name;
                }
                else
                {
                    throw new Error("The last name must be greater than 1 character and less than or equal to 50 characters");
                }
            }
            else
            {
                throw new Error("The last name can not be only spaces characters");
            }
        }
        else
        {
            throw new Error("Last name must be a string");
        }
    }

    PhoneDdi (_ddi)
    {
        return this.#verify_ddi(_ddi)
    }

    #verify_ddi = (_ddi) =>
    {
        const ddi = _ddi;

        if (typeof (ddi) === "string" && ddi.trim().length === 3)
        {
            const regex = /\+[0-9]{2}/;

            if (regex.test(ddi.trim()))
            {
                this.#phone_ddi = ddi.trim();

                return this.#phone_ddi;
            }
            else
            {
                throw new Error("The phone ddi must be in the format +00")
            }

        }
        else
        {
            throw new Error("The phone ddi must be a string with 3 characters");
        }
    }

    PhoneDdd (_ddd)
    {
        return this.#verify_ddd(_ddd);
    }

    #verify_ddd = (_ddd) =>
    {
        const ddd = _ddd;

        if (typeof (ddd) === "string" && ddd.trim().length === 2)
        {
            const regex = /[0-9]{2}/;

            if (regex.test(ddd.trim()))
            {
                this.#phone_ddd = ddd.trim();

                return this.#phone_ddd;
            }
            else
            {
                throw new Error("The phone ddd must be in the format 00")
            }

        }
        else
        {
            throw new Error("The phone ddd must be a string with 2 numeric characters");
        }
    }

    PhoneNumber (_number)
    {
        return this.#verify_phone_number(_number);
    }

    #verify_phone_number = (_number) =>
    {
        const phone_number = _number;

        if (typeof (phone_number) === "string" && (phone_number.trim().length === 8 || phone_number.trim().length === 9))
        {
            const regex = /[0-9]{8,9}/;

            if (regex.test(phone_number.trim()))
            {
                this.#phone_number = phone_number.trim();

                return this.#phone_number;
            }
            else
            {
                throw new Error("The phone number must contain only 8 or 9 numeric characters")
            }

        }
        else
        {
            throw new Error("The phone number must be a string with 8 or 9 numeric characters");
        }
    }

    City (_city)
    {
        return this.#verify_city(_city);
    }

    #verify_city = (_city) =>
    {
        const city = _city;

        if ( typeof (city) === "string" && city.trim().length <= 80)
        {
            const regex = /[a-zA-ZÀ-ü]{80}/gm;
            const regexSpecial = /[ˆ?><,`˜!@#$%ˆ&*()-_+=÷ºª•¶§∞¢£™¡‘“πøˆ¨¥†®´æ…¬k∆˙©ƒ∂ßå÷≥≤µ∫√≈Ω]/gm;

            if (regex.test(city.trim()) && !regexSpecial.test(city.trim().toLowerCase()))
            {
                this.#city = city.trim().toUpperCase();

                return this.#city;
            }
            else
            {
                throw new Error("The city name must be smaller than 80 characters and not contain special characters")
            }
        }

    }

    State (_state)
    {
        return this.#verify_state(_state);
    }

    #verify_state = (_state) =>
    {
        const  state = _state;

        if (typeof (state) === "string" && state.trim().length === 2)
        {
            const regex = /[a-zA-Z]{2}/gm;

            if (regex.test(state.trim()))
            {
                this.#state = state.trim().toUpperCase();

                return this.#state;
            }
            else
            {
                throw new Error("The state must be only letters!");
            }
        }
        else
        {
            throw new Error("The state must be a string with 2 characters");
        }
    }

    Address (_address)
    {
        return this.#verify_address(_address);
    }

    #verify_address = (_address) =>
    {
        const address = _address;

        if ( typeof (address) === "string" && address.trim().length <= 150 && address.trim().length > 2)
        {
            const regexSpecial = /[ˆ?><,`˜!@#$%ˆ&*()-_+=÷ºª•¶§∞¢£™¡‘“πøˆ¨¥†®´æ…¬k∆˙©ƒ∂ßå÷≥≤µ∫√≈Ω]/gm;
            
            if ( !regexSpecial.test(address.trim().toLowerCase()))
            {
                this.#address = address.trim().toUpperCase();

                return this.#address;
            }
            else
            {
                throw new Error("The address must not contain special characters");
            }
        }
        else
        {
            throw new Error("The address must contain at least 2 characters and be smaller than or equal to 150 characters");
        }
    }

    Cpf(_cpf)
    {
        return this.#verify_cpf(_cpf);
    }

    #verify_cpf = (_cpf) =>
    {
        const cpf = _cpf;
        
        if (typeof cpf === "string" && cpf.trim().length === 14)
        {
            const regex = /\d{3}\.\d{3}\.\d{3}-\d{2}/;

            if (regex.test(cpf.trim()))
            {
                const validCpf = checkCPF(cpf);

                function checkCPF (_cpfString)
                {
                    const strCPF = _cpfString.replaceAll(".", "").replace("-", "").trim();
        
                    let sum;
                    let rest;
                    sum = 0;   
        
                    if (strCPF === "00000000000")
                    {
                        return false;
                    };
                
                    for (let i = 1; i <= 9; i++)
                    {
                        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
                    };
                
                    rest = (sum * 10) % 11;
                    if ((rest === 10) || (rest === 11)) 
                    {
                        rest = 0;
                    };
                
                    if (rest !== parseInt(strCPF.substring(9, 10)))
                    {
                        return false;
                    };
                
                    sum = 0;
                    for (let i = 1; i <= 10; i++)
                    {       
                        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
                    };
                
                    rest = (sum * 10) % 11;
                    if ((rest === 10) || (rest === 11)) 
                    {
                        rest = 0;
                    };
                
                    if (rest !== parseInt(strCPF.substring(10, 11)))
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    };
                }

                if (validCpf)
                {
                    this.#cpf = cpf.trim();

                    return this.#cpf;
                }
                else
                {
                    throw new Error("Invalid Cpf");
                }
            }
            else
            {
                throw new Error("The CPF must be on the format XXX.XXX.XXX-XX")
            }
        } 
        else
        {   
            throw new Error("The CPF must be passed as a string with 14 characters");
        }
    }

    Username (_username)
    {
        return this.#verify_username(_username);
    }

    #verify_username = (_username) =>
    {
        const username = _username;

        if (typeof (username) === "string" && username.trim().length <= 18 && username.trim().length > 3)
        {
            const regex = /\W/;

            if (!regex.test(username))
            {
                this.#username = username.trim();

                return this.#username;
            }
            else
            {
                throw new Error("The username can only be composed of letters, numbers and underscores");
            }
        }
        else
        {
            throw new Error("The username must be a string with at least 4 characters and be smaller than or equal to 18 characters");
        }
    }

    Password (_password)
    {
        return this.#verify_password(_password);
    }

    #verify_password = (_password) =>
    {
        const password = _password;
        const regex = /\s/;

        if (typeof (password) === "string" && !regex.test(password))
        {
            if (password.length <= 20 && password.length >= 8)
            {
                this.#password = password;

                return this.#password;
            }
            else
            {
                throw new Error("The password must contain at least 8 characters and me smaller than or equal to 20 characters");
            }
        }
        else
        {
            throw new Error("The password must be a string without spaces");
        }
    }
}

const EmployeesTable = new TableEmployees();

export default EmployeesTable;
