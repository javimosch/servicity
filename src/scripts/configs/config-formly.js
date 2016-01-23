exports.configure = (app) => {
    app.config(config)
    app.run(run);
};
var run = (formlyConfig, formlyValidationMessages) => {
    formlyConfig.extras.ngModelAttrsManipulatorPreferBound = true;
    formlyValidationMessages.addStringMessage('maxlength', 'Your input is WAAAAY too long!');
    formlyValidationMessages.messages.pattern = function (viewValue, modelValue, scope) {
        return viewValue + ' is invalid';
    };
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'is the minimum length', 'Too short');
};
var config = (formlyConfigProvider) => {


    formlyConfigProvider.setType([
        {
            name: 'input',
            templateUrl: 'input-template.html',
            overwriteOk:true
        },
        {
            name: 'checkbox',
            templateUrl: 'checkbox-template.html',
            overwriteOk:true
        }
    ]);
    formlyConfigProvider.setWrapper([
        {
            template: [
                '<div class="formly-template-wrapper form-group"',
                'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
                '<label for="{{::id}}">{{options.templateOptions.label}} {{options.templateOptions.required ? \'*\' : \'\'}}</label>',
                '<formly-transclude></formly-transclude>',
                '<div class="validation"',
                'ng-if="options.validation.errorExistsAndShouldBeVisible"',
                'ng-messages="options.formControl.$error">',
                '<div ng-messages-include="validation.html"></div>',
                '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
                '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
                '</div>',
                '</div>',
                '</div>'
            ].join(' ')
        },
        {
            template: [
                '<div class="checkbox formly-template-wrapper-for-checkboxes form-group">',
                '<label for="{{::id}}">',
                '<formly-transclude></formly-transclude>',
                '</label>',
                '</div>'
            ].join(' '),
            types: 'checkbox'
        }
    ]);

};