(function(){
    'use strict';

    /*
     * Direktivy
     */

    var module = angular.module('nodeseo.directives', []);


    /*
     * Scroll to #id
     */
    module.directive('scroll', function($routeParams, $location){
        return {
            restrict: 'A',
            link: function($scope, $elm, $attr){
                $elm.click(function(){
                    $('html,body').animate({scrollTop: $($attr.scrollTo).offset().top}, 'slow');
                });
            }
        };
    });


    /*
     * Colorbox
     */
    module.directive('colorbox', function(){
        return {
            restrict: 'AC',
            link: function($scope, $elm, $attr){
                $($elm).colorbox($attr.colorbox);
            }
        };
    });


    /*
     * Compare two text fields
     * @source https://groups.google.com/forum/#!msg/angular/R4QeNsNksdY/migbplv8GxIJ
     */
    module.directive('uiValidateEquals', function(){
        var config = {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, $elm, $attr, $ctrl){

                function validateEqual(myValue, otherValue){
                    if (myValue === otherValue) {
                        $ctrl.$setValidity('equal', true);
                        return myValue;
                    }
                    else if (!myValue && !otherValue) {
                        $ctrl.$setValidity('equal', true);
                        return myValue;
                    }
                    else {
                        $ctrl.$setValidity('equal', false);
                        return undefined;
                    }
                }

                $scope.$watch($attr.uiValidateEquals, function(otherModelValue){
                    validateEqual($ctrl.$viewValue, otherModelValue);
                });

                $ctrl.$parsers.unshift(function(viewValue){
                    return validateEqual(viewValue, $scope.$eval($attr.uiValidateEquals));
                });

                $ctrl.$formatters.unshift(function(modelValue){
                    return validateEqual(modelValue, $scope.$eval($attr.uiValidateEquals));
                });
            }
        };
        return config;
    });


    /*
     * DataTable
     * @source https://github.com/angular/angular.js/wiki/JSFiddle-Examples#version-100-rc1
     *         jQuery DataTables plugin (zdam)
     *         http://jsfiddle.net/zdam/7kLFU/
     */
    module.directive('jqDataTable', function(){
        return function($scope, $elm, $attr){
            var options = {
                'bStateSave': true,
                'iCookieDuration': 2419200, /* 1 month */
                'bJQueryUI': true,
                'bPaginate': true,
                'bLengthChange': true,
                'bFilter': true,
                'bInfo': true,
                'bDestroy': true
            };
            var explicitColumns = [];
            $elm.find('th').each(function(index, elem){
                explicitColumns.push($(elem).text());
            });
            if ($attr.aoColumnDefs) {
                options.aoColumnDefs = $scope.$eval($attr.aoColumnDefs);
            }
            if ($attr.fnRowCallback) {
                options.fnRowCallback = $scope.$eval($attr.fnRowCallback);
            }
            var dataTable = $elm.dataTable(options);
            $scope.$watch($attr.aaData, function(value){
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData($scope.$eval($attr.aaData));
                }
            });
        };
    });


    /*
     * Validation on the form for creating a new test
     * @source https://github.com/angular/angular.js/wiki/JSFiddle-Examples#version-102
     *         Form Validation with Tooltips using Validation CSS Classnames (Adam Bradley)
     *         http://jsfiddle.net/adamdbradley/Qdk5M/
     */
    module.directive('wordValidate', function(){
        var config = {
            require: 'ngModel',
            link: function($scope, $elm, $attr, $ctrl){
                $ctrl.$parsers.unshift(function(viewValue){
                    $scope.pwdValidLength = (viewValue && viewValue.length >= 3 ? 'valid' : undefined);
                    $scope.pwdHasLetter = (viewValue && (viewValue.indexOf(' ') === -1) && (viewValue.indexOf(',') === -1)) ? 'valid' : undefined;
                    if ($scope.pwdValidLength && $scope.pwdHasLetter) {
                        $ctrl.$setValidity('pwd', true);
                    } else {
                        $ctrl.$setValidity('pwd', false);
                    }
                    return viewValue;
                });
            }
        };
        return config;
    });


    /*
     * Confirm dialog
     * @source http://wegnerdesign.com/blog/angular-js-directive-tutorial-on-attribute-bootstrap-confirm-button
     */
    module.directive('confirmButton', function($document, $parse){
        var config = {
            restrict: 'A',
            link: function($scope, $elm, $attr){
                var buttonId, html, nope, yep;
                buttonId = Math.floor(Math.random() * 10000000000);
                $attr.buttonId = buttonId;
                yep = $attr.yes || 'Ano';
                nope = $attr.no || 'Ne';
                html = '<div id="button-' + buttonId + '"><button class="confirmbutton-yes btn btn-inverse">' + yep + '</button>' + "\n" + '<button class="confirmbutton-no btn btn-info">' + nope + '</button></div>';
                $elm.popover({
                    content: html,
                    html: true,
                    trigger: 'manual',
                    placement: 'left'
                });
                return $elm.bind('click', function(e){
                    var dontBubble, pop;
                    dontBubble = true;
                    e.stopPropagation();
                    $elm.popover('show');
                    pop = $('#button-' + buttonId);
                    pop.closest('.popover').click(function(e){
                        if (dontBubble) {
                            e.stopPropagation();
                        }
                    });
                    pop.find('.confirmbutton-yes').click(function(e){
                        dontBubble = false;
                        var func = $parse($attr.confirmButton);
                        func($scope);
                    });
                    pop.find('.confirmbutton-no').click(function(e){
                        dontBubble = false;
                        $document.off('click.confirmbutton.' + buttonId);
                        $elm.popover('hide');
                    });
                    $document.on('click.confirmbutton.' + buttonId, ':not(.popover, .popover *)', function(){
                        $document.off('click.confirmbutton.' + buttonId);
                        $elm.popover('hide');
                    });
                });
            }
        };
        return config;
    });


    /*
     * Graph #1
     */
    module.directive('chartSize', function($timeout){
        var config = {
            restrict: 'A',
            link: function($scope, $elm, $attr){
                $timeout(function(){ // without using timeout it will have bad size
                    var data, options, chart, htmlSize, cssSize, jsSize, imgSize;
                    $attr.$observe('htmlSize', function(value){
                        htmlSize = value || '0';
                    });
                    $attr.$observe('cssSize', function(value){
                        cssSize = value || '0';
                    });
                    $attr.$observe('jsSize', function(value){
                        jsSize = value || '0';
                    });
                    $attr.$observe('imgSize', function(value){
                        imgSize = value || '0';

                        data = new google.visualization.DataTable();
                        data.addColumn('string', 'Typ dat');
                        data.addColumn('number', 'Velikost');
                        data.addRows([
                            ['HTML: ' + htmlSize + ' kB', parseInt(htmlSize, 10)],
                            ['CSS: ' + cssSize + ' kB', parseInt(cssSize, 10)],
                            ['JS: ' + jsSize + ' kB', parseInt(jsSize, 10)],
                            ['Obrázky: ' + imgSize + ' kB', parseInt(imgSize, 10)]
                        ]);
                        options = {
                            width: 'auto',
                            height: '276',
                            backgroundColor: 'transparent',
                            colors: ['#74b749', '#0daed3', '#ed6d49', '#ffb400'],
                            tooltip: {
                                textStyle: {
                                    color: '#666666',
                                    fontSize: 11
                                },
                                showColorCode: true
                            },
                            legend: {
                                position: 'left',
                                textStyle: {
                                    color: 'black',
                                    fontSize: 12
                                }
                            },
                            chartArea: {
                                left: 0,
                                top: 10,
                                width: '100%',
                                height: '100%'
                            }
                        };
                        chart = new google.visualization.PieChart($elm[0]);
                        chart.draw(data, options);
                    });
                });
            }
        };
        return config;
    });


    /*
     * Graph #2
     */
    module.directive('chartLink', function($timeout){
        var config = {
            restrict: 'A',
            link: function($scope, $elm, $attr){
                $timeout(function(){ // without using timeout it will have bad size
                    var data, options, chart, extFol, extNofol, intFol, intNofol;
                    $attr.$observe('extFol', function(value){
                        extFol = value || '0';
                    });
                    $attr.$observe('extNofol', function(value){
                        extNofol = value || '0';
                    });
                    $attr.$observe('intFol', function(value){
                        intFol = value || '0';
                    });
                    $attr.$observe('intNofol', function(value){
                        intNofol = value || '0';

                        data = new google.visualization.DataTable();
                        data.addColumn('string', 'Typ odkazu');
                        data.addColumn('number', 'Počet');
                        data.addRows([
                            ['Ext. follow: ' + extFol, parseInt(extFol, 10)],
                            ['Ext. nofollow: ' + extNofol, parseInt(extNofol, 10)],
                            ['Int. follow: ' + intFol, parseInt(intFol, 10)],
                            ['Int. nofollow: ' + intNofol, parseInt(intNofol, 10)]
                        ]);
                        options = {
                            width: 'auto',
                            height: '186',
                            backgroundColor: 'transparent',
                            colors: ['#74b749', '#0daed3', '#ed6d49', '#ffb400'],
                            tooltip: {
                                textStyle: {
                                    color: '#666666',
                                    fontSize: 11
                                },
                                showColorCode: true
                            },
                            legend: {
                                position: 'left',
                                textStyle: {
                                    color: 'black',
                                    fontSize: 12
                                }
                            },
                            chartArea: {
                                left: 0,
                                top: 10,
                                width: '100%',
                                height: '100%'
                            }
                        };
                        chart = new google.visualization.PieChart($elm[0]);
                        chart.draw(data, options);
                    });
                });
            }
        };
        return config;
    });

    google.setOnLoadCallback(function(){
        angular.bootstrap(document.body, ['nodeseo.directives']);
    });
    google.load('visualization', '1', {packages: ['corechart']});

})();