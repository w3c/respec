"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("W3C — Abstract", () => {
  afterAll(flushIframes);

  it("includes a h2 and sets the class", async () => {
    const ops = makeStandardOps();
    ops.abstract = "<p>test abstract</p>";
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    const h2 = abs.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("Abstract");
    expect(abs.classList).toContain("introductory");
    expect(abs.querySelector("p")).toBeTruthy();
  });

  it("generates an error when the abstract is missing", async () => {
    const errorsFilter = errorFilters.filter("w3c/abstract");
    const ops = makeStandardOps();
    ops.abstract = null;
    const doc = await makeRSDoc(ops);
    const errors = errorsFilter(doc);
    expect(errors).toHaveSize(1);
  });

  it("allows custom header in the abstract", async () => {
    const ops = makeStandardOps();
    ops.abstract = `<h2>Custom header</h2>`;
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    const h2 = abs.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("Custom header");
  });

  it("allows author to add the h2 to the abstract", async () => {
    const ops = makeStandardOps();
    ops.abstract = `<h2>Abstract</h2>`;
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    const h2 = abs.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("Abstract");
  });

  it("localizes the abstract", async () => {
    const ops = makeStandardOps();
    ops.htmlAttrs = {
      lang: "ja",
    };
    ops.abstract = `<p>test abstract</p>`;
    const doc = await makeRSDoc(ops);
    const abs = doc.getElementById("abstract");
    expect(abs.querySelector("h2").textContent).toBe("要約");
  });

  it("supports abstracts created from markdown documents", async () => {
    const doc = await makeRSDoc(null, "spec/w3c/abstract-markdown.html");
    const abs = doc.getElementById("abstract");
    expect(abs.querySelector("h2").textContent).toBe("Abstract");
  });

  it("converts legacy div#abstract to section#abstract", async () => {
    const doc = await makeRSDoc(null, "spec/w3c/abstract-legacy-div.html");
    expect(doc.querySelector("div#abstract")).toBeNull();
    expect(doc.querySelector("section#abstract.introductory")).toBeTruthy();
    expect(doc.querySelector("section#abstract > h2").textContent).toBe(
      "Abstract"
    );
    expect(doc.querySelector("section#abstract>p").textContent).toBe(
      "The abstract."
    );
  });

  it("gets upset if the abstract is not a section", async () => {
    const ops = makeStandardOps();
    ops.abstract = null;
    ops.body = `<p id="abstract">`;
    const doc = await makeRSDoc(ops);
    const errors = errorFilters.filter("w3c/abstract")(doc);
    expect(errors).toHaveSize(1);
    const [error] = errors;
    expect(error.message).toBe("The abstract should be a `<section>` element.");
  });
});
