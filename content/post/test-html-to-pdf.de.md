---
title: "Test HTML to PDF Shortcode"
date: 2025-11-17T10:00:00+01:00
draft: true
---

This is a test post to demonstrate the HTML to PDF shortcode.

{{< html2pdf >}}
    <h1>Hello, {{`{{`}}CALLSIGN}}!</h1>
    <p>This content will be converted to a PDF document.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
    <p>Current Date: {{ .Date.Format "2006-01-02" }}</p>
{{< /html2pdf >}}
