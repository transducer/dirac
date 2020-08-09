// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {ls} from '../platform/platform.js';

import {Issue, IssueCategory, IssueDescription, IssueKind} from './Issue.js';  // eslint-disable-line no-unused-vars

export class ContentSecurityPolicyIssue extends Issue {
  /**
   * @param {!Protocol.Audits.ContentSecurityPolicyIssueDetails} issueDetails
   */
  constructor(issueDetails) {
    const issue_code = [
      Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue, issueDetails.contentSecurityPolicyViolationType
    ].join('::');
    super(issue_code);
    this._issueDetails = issueDetails;
  }

  /**
   * @override
   * @return {!IssueCategory}
   */
  getCategory() {
    return IssueCategory.ContentSecurityPolicy;
  }

  /**
   * @override
   * @return {string}
   */
  primaryKey() {
    return JSON.stringify(this._issueDetails, [
      'blockedURL', 'contentSecurityPolicyViolationType', 'violatedDirective', 'sourceCodeLocation', 'url',
      'lineNumber', 'columnNumber', 'violatingNodeId'
    ]);
  }

  /**
   * @override
   * @returns {?IssueDescription}
   */
  getDescription() {
    const description = issueDescriptions.get(this._issueDetails.contentSecurityPolicyViolationType);
    if (description) {
      return description;
    }
    return null;
  }

  /**
   * @override
   * @returns {!Iterable<!Protocol.Audits.ContentSecurityPolicyIssueDetails>}
   */
  cspViolations() {
    return [this._issueDetails];
  }
}

/**
 * @param {!Array<string>} paragraphs
 * @param {!Array<string>} fixesList
 * @return {!Element}
 */
function paragraphedMessage(paragraphs, fixesList) {
  const message = document.createElement('div');
  message.classList.add('message');
  for (const paragraph of paragraphs) {
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent = paragraph;
    message.appendChild(paragraphElement);
  }
  if (fixesList.length > 0) {
    const inlineFixesList = document.createElement('ul');
    inlineFixesList.classList.add('resolutions-list');
    message.append(inlineFixesList);
    for (const fixSuggestion of fixesList) {
      const listItem = document.createElement('li');
      listItem.textContent = fixSuggestion;
      inlineFixesList.append(listItem);
    }
  }
  return message;
}

const cspURLViolation = {
  title:
      ls`Content Security Policy of your site blockes some resources because their origin is not included in the content security policy header`,
  message: () => paragraphedMessage(
      [
        ls`The Content Security Policy (CSP) improves the security of your site by defining a list of trusted sources and
     instructs the browser to only execute or render resources from this list. Some resources on your site can't be accessed
     because their origin is not listed in the CSP.`,
        ls`To solve this, carefully check that all of the blocked resources listed below are trustworthy; if they are,
     include their sources in the content security policy of your site. You can set a policy as a HTTP header (recommended),
     or via an HTML <meta> tag.`,
        ls`⚠️ Never add a source you don't trust to your site's Content Security Policy. If you don't trust the source, consider
     hosting resources on your own site instead.`
      ],
      []),
  issueKind: IssueKind.BreakingChange,
  links: [{
    link: 'https://developers.google.com/web/fundamentals/security/csp#source_whitelists',
    linkTitle: ls`Content Security Policy - Source Allowlists`
  }],
};

const cspInlineViolation = {
  title: ls`Content Security Policy blocks inline execution of scripts and stylesheets`,
  message: () => paragraphedMessage(
      [
        ls`The Content Security Policy (CSP) prevents cross-site scripting attacks by blocking inline execution of scripts
     and style sheets.`,
        ls`To solve this, move all inline scripts (e.g. onclick=[JS code]) and styles into external files.`,
        ls`⚠️ Allowing inline execution comes at the risk of script injection via injection of HTML script elements.
     If you absolutely must, you can allow inline script and styles by:`
      ],
      [
        ls`adding unsafe-inline as a source to the CSP header`,
        ls`adding the hash or nonce of the inline script to your CSP header.`
      ]),
  issueKind: IssueKind.BreakingChange,
  links: [{
    link: 'https://developers.google.com/web/fundamentals/security/csp#inline_code_is_considered_harmful',
    linkTitle: ls`Learn more: Content Security Policy - Inline Code`
  }],
};

/** @type {string} */
export const urlViolationCode = [
  Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue,
  Protocol.Audits.ContentSecurityPolicyViolationType.KURLViolation
].join('::');

/** @type {string} */
export const inlineViolationCode = [
  Protocol.Audits.InspectorIssueCode.ContentSecurityPolicyIssue,
  Protocol.Audits.ContentSecurityPolicyViolationType.KInlineViolation
].join('::');

// TODO(crbug.com/1082628): Add handling of other CSP violation types later as they'll need more work.
/** @type {!Map<!Protocol.Audits.ContentSecurityPolicyViolationType, !IssueDescription>} */
const issueDescriptions = new Map([
  [Protocol.Audits.ContentSecurityPolicyViolationType.KURLViolation, cspURLViolation],
  [Protocol.Audits.ContentSecurityPolicyViolationType.KInlineViolation, cspInlineViolation],
]);
