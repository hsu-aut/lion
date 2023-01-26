import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class cValFns {

    /**
     * Validator making sure that no protocol is specified
     * @param pattern Pattern to check
     * @returns
     */
    noProtocol(): ValidatorFn {

        const protocols = new DefaultRegularExpressions().protocols;

        return (control: AbstractControl): ValidationErrors | null => {
            // checks if one of the protocols is found
            const protocolFound = protocols.find(protocol => protocol.regularExpression.test(control.value));
            return protocolFound ? {protocolForbidden: {value: control.value}} : null;
        };
    }

    /**
     * Custom validator checking that no special characters are present
     * @returns
     */
    noSpecialCharacters(): ValidatorFn {

        const specialCharacters = new DefaultRegularExpressions().specialCharacters;
        return (control: AbstractControl): ValidationErrors | null => {
            // checks if one of the protocols is found
            const specialCharacterFound = specialCharacters.find(specialChar => specialChar.regularExpression.test(control.value));
            return specialCharacterFound ? {specialCharacterForbidden: {value: control.value}} : null;
        };
    }

    /**
     * Simple validator checking whether or not the given form control is an identifier
     * @returns
     */
    noIdentifier(): ValidatorFn {
        // TODO: This seems to be a very much simplified validator... What
        const identifierRegExp =  /urn:/i;      // Simple regexp looking for urn only

        return (control: AbstractControl): ValidationErrors | null => {
            // checks if one of the protocols is found
            const isIdentifier = identifierRegExp.test(control.value);
            return isIdentifier ? {isIdentifier: {value: control.value}} : null;
        };
    }

    /**
     * Validator checking that control value is a correct domain (localhost or IP / URL)
     * @returns
     */
    isDomain(): ValidatorFn {

        const domains = new DefaultRegularExpressions().domain;

        return (control: AbstractControl): ValidationErrors | null => {
        // checks if one of the protocols is found
            const noDomain = domains.find(domain => domain.regularExpression.test(control.value));
            return noDomain ? {noDomain: {value: control.value}} : null;
        };
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
