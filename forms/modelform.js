var ModelForm = function(model, formType, params, locale)
{
    var forms = require('forms-mongoose');
    var form = forms.create(model, params, formType);
    var i18n = require('i18n');
    this.bootstrapField = function(name, object) {
        var textLabel = i18n.__({phrase: name, locale: locale});
        var label = object.labelHTML(textLabel);
        var error = object.errorHTML();
        object.widget.attrs = {placeholder: textLabel};
        if (name === 'dateOfBirth') {
            object.widget.attrs.datePicker = 'yy-mm-dd';
        }
        object.widget.attrs['ng-model'] = 'user.'+name;
        if (name === 'email') {
            object.widget.attrs['disabled'] = 'disabled';
        }
        //object.widget.attrs['disabled'] = 'disabled';
        var widget = object.widget.toHTML(name, object) + error;
        return '<div class="field form-group ' + (error !== '' ? 'has-error' : '') + '">' + label + '<span class="required">* </span> ' + widget + '</div>';
    };

    this.formToHtml = form.toHTML;
    var $me = this;
    form.toHTML = function(name, object) {
        return $me.formToHtml.call(form, $me.bootstrapField);
    };
    return form;
};

module.exports = ModelForm;