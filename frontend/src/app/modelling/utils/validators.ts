import { FormControl } from '@angular/forms';

export class cValFns {

    noProtocol(pattern: FormControl) {

        const protocols = new DefaultRegularExpressions().protocols;

        let noProtocol = true;
        const validatePattern = { valid: false };

        // checks if there is a match between the regexes of the protocols and the pattern
        for (let i = 0; i < protocols.length; i++) {
            if (protocols[i].regularExpression.test(pattern.value)) {
                noProtocol = false;
                const description = "ProtocolMatch" + i;
                validatePattern[description] = protocols[i].name;
            }
        }

        return noProtocol ? null : { validatePattern };
    }

    noSpecialCharacters(pattern: FormControl) {

        const specialCharacters = new DefaultRegularExpressions().specialCharacters;
        let noSpecialCharacter = true;

        const validatePattern = { valid: false };

        // checks if there is a match between the regexes of the special characters and the pattern
        for (let i = 0; i < specialCharacters.length; i++) {
            if (specialCharacters[i].regularExpression.test(pattern.value)) {
                noSpecialCharacter = false;
                const description = "SpecialCharacterMatch" + i;
                validatePattern[description] = specialCharacters[i].name;
            }
        }

        return noSpecialCharacter ? null : { validatePattern };
    }

    noIdentifier(pattern: FormControl) {

        const identifiers = new DefaultRegularExpressions().identifiers;
        let noidentifier = true;

        const validatePattern = { valid: false };

        // checks if there is a match between the regexes of the special characters and the pattern
        for (let i = 0; i < identifiers.length; i++) {
            if (identifiers[i].regularExpression.test(pattern.value)) {
                noidentifier = false;
                const description = "IdentifierMatch" + i;
                validatePattern[description] = identifiers[i].name;
            }
        }

        return noidentifier ? null : { validatePattern };
    }

    isDomain(pattern: FormControl) {

        const domain = new DefaultRegularExpressions().domain;
        let isDomain = false;

        const validatePattern = { valid: false };

        // checks if there is a match between the regexes of the special characters and the pattern
        for (let i = 0; i < domain.length; i++) {
            if (domain[i].regularExpression.test(pattern.value)) {
                isDomain = true;
            } else {
                const description = "isNoMatchWith" + i;
                validatePattern[description] = domain[i].name;
            }
        }
        return isDomain ? null : { validatePattern };
    }

}

class DefaultRegularExpressions {
    protocols: Array<RegularExpressionObject> = [
        { name: "ip", regularExpression: /ip:/i },
        { name: "tcp", regularExpression: /tcp:/i },
        { name: "ssl", regularExpression: /ssl:/i },
        { name: "http", regularExpression: /http:/i },
        { name: "opc", regularExpression: /opc:/i },
        { name: "ftp", regularExpression: /ftp:/i },
        { name: "ssh", regularExpression: /ssh:/i },
    ]

    identifiers: Array<RegularExpressionObject> = [
        { name: "urn", regularExpression: /urn:/i },
    ]

    specialCharacters: Array<RegularExpressionObject> = [
        { name: "!", regularExpression: /\!/i },
        { name: '"', regularExpression: /\"/i },
        { name: '§', regularExpression: /\§/i },
        { name: '$', regularExpression: /\$/i },
        { name: '%', regularExpression: /\%/i },
        { name: '&', regularExpression: /\&/i },
        { name: '(', regularExpression: /\(/i },
        { name: ')', regularExpression: /\)/i },
        { name: '=', regularExpression: /\=/i },
        { name: "?", regularExpression: /\?/i },
        { name: '`', regularExpression: /\`/i },
        { name: '´', regularExpression: /\´/i },
        { name: '*', regularExpression: /\*/i },
        { name: '+', regularExpression: /\+/i },
        { name: '~', regularExpression: /\~/i },
        { name: '<', regularExpression: /\</i },
        { name: '>', regularExpression: /\>/i },
        { name: '|', regularExpression: /\|/i },
        { name: '@', regularExpression: /\@/i },
        { name: '^', regularExpression: /\^/i },
        { name: '°', regularExpression: /\°/i },
        { name: ';', regularExpression: /\;/i },
        { name: '#', regularExpression: /\#/i },
    ]

    domain: Array<RegularExpressionObject> = [
        { name: "localhostDomain", regularExpression: /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/i },
        { name: "nonLocalhostDomain", regularExpression: /^[^\s\.]+\.\S{2,}$/i },
    ]
}

interface RegularExpressionObject {
    name: string;
    regularExpression: RegExp;
}
