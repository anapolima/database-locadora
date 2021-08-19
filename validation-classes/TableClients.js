class TableClients
{
    #id
    #first_name
    #last_name
    #phone_ddi
    #phone_ddd
    #phone_number
    #document
    #username
    #password

    constructor ()
    {
        this.#id = undefined;
        this.#first_name = undefined;
        this.#last_name = undefined;
        this.#phone_ddi = undefined;
        this.#phone_ddd = undefined;
        this.#phone_number = undefined;
        this.#document = undefined;
        this.#username = undefined;
        this.#password = undefined;
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
            const regex = /\+[0-9]{2}$/;

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
            const regex = /[0-9]{2}$/;

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
            const regex = /[0-9]{8,9}$/;

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

    Document(_cpf)
    {
        return this.#verify_document(_cpf);
    }

    #verify_document = (_document) =>
    {
        const document = _document.trim();

        if (document.length == 14)
        {
            if (this.#verify_cpf(document))
            {
                this.#document = document;

                return this.#document;
            }
            else
            {
               throw new Error("Invalid CPF");
            }
        }
        else if (document.length == 18)
        {
            if (this.#verify_cnpj(document))
            {
                this.#document = document;

                return this.#document;
            }
            else
            {
                throw new Error("Invalid CNPJ");
            }
        }
        else
        {
            throw new Error("The document must be a CPF (XXX.XXX.XXX-XX) or a CNPJ (XX.XXX.XXX/XXXX-XX)");
        }

    }

    #verify_cpf = (_document) =>
    {
        const cpf = _document.trim();
        const regex = /\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        
        if (typeof cpf === "string" && regex.test(cpf))
        {
            const validCpf = checkCPF(cpf);

            function checkCPF (_cpfString)
            {
                const strCPF = _cpfString.trim().replace(/[^\d]+/g,'');

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
                return true;
            }
            else
            {
                throw new Error("Invalid Cpf");
            }
        } 
        else
        {   
            return false;
        }
    }

    #verify_cnpj = (_document) =>
    {
        const cnpj = _document.trim();
        const regex = /^\d{2}\.\d{3}\.\d{3}\/000[1|2]-\d{2}$/;

        if (typeof (cnpj) === "string" && regex.test(cnpj))
        {
            cnpj = cnpj.replace(/[^\d]+/g,'');
        
            if(cnpj === '')
            {
                return false;
            }
            
            if (cnpj.length != 14)
            {
                return false;
            }
        
            // Elimina CNPJs invalidos conhecidos
            if (cnpj === "00000000000000" || 
                cnpj === "11111111111111" || 
                cnpj === "22222222222222" || 
                cnpj === "33333333333333" || 
                cnpj === "44444444444444" || 
                cnpj === "55555555555555" || 
                cnpj === "66666666666666" || 
                cnpj === "77777777777777" || 
                cnpj === "88888888888888" || 
                cnpj === "99999999999999")
            {
                return false;
            }
                
            // Valida DVs
            let size = cnpj.length - 2
            let numbers = cnpj.substring(0, size);
            let digits = cnpj.substring(size);
            let sum = 0;
            let pos = size - 7;
    
            for (i = size; i >= 1; i--)
            {
                sum += numbers.charAt(size - i) * pos--;

                if (pos < 2)
                {
                    pos = 9;
                }
            }
    
            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    
            if (result != digits.charAt(0))
            {
                return false;
            }
                
            size = size + 1;
            numbers = cnpj.substring(0,size);
            sum = 0;
            pos = size - 7;
    
            for (i = size; i >= 1; i--)
            {
                sum += numbers.charAt(size - i) * pos--;
                
                if (pos < 2)
                {
                    pos = 9;
                }
            }
    
            result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    
            if (result != digits.charAt(1))
            {
                return false;
            }
                
            return true;
        }
        else
        {
            return false;
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

const ClientsTable = new TableClients();

export default ClientsTable;
