'use strict'

/**
 * @fileoverview Enforce spies to be defined in before/after/it blocks
 * @author Nicolas Fernandez @burabure
 */

var blocksWhitelistRegexp = /^(f|d|x)?(before\w+|after\w+|it)$/

function getParentCallExpression (ancestors) {
  for (var i = (ancestors.length - 1); i > 0; i--) {
    if (ancestors[i].type === 'CallExpression') { return ancestors[i] }
  }
  return false
}

module.exports = function (context) {
  return {
    CallExpression: function (node) {
      if (
        node.callee.name !== 'spyOn' &&
        !(node.callee.object && node.callee.object.name === 'jasmine') &&
        !(node.callee.property && node.callee.property.name === 'createSpy')
      ) { return }

      var parentCallExpression = getParentCallExpression(context.getAncestors())
      if (parentCallExpression) {
        if (blocksWhitelistRegexp.test(parentCallExpression.callee.name)) { return }
      }

      context.report(node, 'Spy declared outside of before/after/it block')
    }
  }
}
