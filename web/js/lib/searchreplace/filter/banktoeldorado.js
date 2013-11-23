/*
@class BankToEldoradoFilter
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['searchreplace/filter/filter', 'jquery'], function(SRFilter, $) {
    "use strict";
    var SRBankToEldoradoFilter, _ref;
    SRBankToEldoradoFilter = (function(_super) {
      __extends(SRBankToEldoradoFilter, _super);

      function SRBankToEldoradoFilter() {
        _ref = SRBankToEldoradoFilter.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      @param {*} input
      @returns {*}
      */


      SRBankToEldoradoFilter.prototype.update = function(input) {
        var $input, $lines, lines;
        lines = ['!type Bank'];
        $input = $(input);
        $lines = $input.find('tr');
        $lines.each(function() {
          var $tr, data, line;
          $tr = $(this);
          data = {
            'datecompta': $tr.find('td:eq(0) .itemFormReadOnly').text(),
            'libelleop': $tr.find('td:eq(1) .itemFormReadOnly').text(),
            'ref': $tr.find('td:eq(2) .itemFormReadOnly').text(),
            'dateope': $tr.find('td:eq(3) .itemFormReadOnly').text(),
            'dateval': $tr.find('td:eq(4) .itemFormReadOnly').text(),
            'debit': $tr.find('td:eq(5) .itemFormReadOnly').text().replace(' ', ''),
            'credit': $tr.find('td:eq(6) .itemFormReadOnly').text().replace(' ', '')
          };
          line = ['D' + data['datecompta'], 'T' + (data['debit'] !== '' ? '-' + data['debit'] : '+' + data['credit']), 'N' + data['ref'], 'M' + data['libelleop']];
          /*
          label = data['libelleop']
          if label.match /(MONOPRIX|FRANPRIX)/
            line.push 'L' + 'Alimentation quotidienne'
          else if label.match /SNCF/
            line.push 'L' + 'Transports'
          else if label.match /BIG YOUTH/
            line.push 'L' + 'Salaire'
          */

          line.push('^');
          return lines = lines.concat(line);
        });
        return lines.join("\n");
      };

      return SRBankToEldoradoFilter;

    })(SRFilter);
    return SRBankToEldoradoFilter;
  });

}).call(this);
