import React from 'react'
const createInlineStyleButton = require('./utils/createInlineStyle').default
const createBlockAlignmentButton = require('./utils/createBlockAlignment').default
const createBlockStyleButton = require('./utils/createBlockStyle').default


exports.ItalicButton = createInlineStyleButton({style: 'ITALIC',children: (<i>К</i>)})
exports.BoldButton = createInlineStyleButton({style: 'BOLD',children: (<b>Ж</b>)})
exports.UnderlineButton = createInlineStyleButton({style: 'UNDERLINE',children: (<u>Ч</u>)})

exports.UnorderedListButton = createBlockStyleButton({ blockType: 'unordered-list-item',children: (<i className="fa fa-list-ul"></i>)})
exports.OrderedListButton = createBlockStyleButton({ blockType: 'ordered-list-item',children: (<i className="fa fa-list-ol"></i>)})

exports.AlignBlockCenterButton = createBlockAlignmentButton({alignment: 'center', children: (<i className="icon-align-center"></i>)})
exports.AlignBlockJustifyButton = createBlockAlignmentButton({alignment: 'justify', children: (<i className="icon-align-justified"></i>)})
exports.AlignBlockLeftButton = createBlockAlignmentButton({alignment: 'left', children: (<i className="icon-align-left"></i>)})
exports.AlignBlockRightButton = createBlockAlignmentButton({alignment: 'right', children: (<i className="icon-align-right"></i>)})


exports.HeadlinesButton = require('./headLine').default
exports.UserPlaceHolderButton = require('./placeholder').default
exports.UserViewingIf = require('./viewingif').default

exports.undo = require('./undoRedo').default

exports.table = require('./table').default

exports.PageOrientation = require('./pageOrientation').default

exports.PageBreak = require('./pagebreak').default