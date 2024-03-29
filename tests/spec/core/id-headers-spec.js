"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - ID headers", () => {
  afterAll(flushIframes);
  let doc;
  const body = `
    <section class="introductory"><h2>Intro</h2></section>
    <section id="t0"><h6>FOO</h6></section>
    <section><h2>test-1</h2></section>
    <section><h2 id="custom-id">Pass</h2></section>
    <section id="sotd" class="notoc">
      <p>...</p>
      <section>
        <h3>Level 3 heading</h3>
        <section>
          <h4>Level 4 heading</h4>
        </section>
      </section>
    </section>
    <section class="appendix">
      <h2 id="a1">Appendix 1</h2>
      <section>
        <h3 id="a2">Level 3 appendix</h3>
      </section>
    </section>
  `;
  beforeAll(async () => {
    const ops = makeStandardOps({ addSectionLinks: true }, body);
    doc = await makeRSDoc(ops);
  });

  it("sets an id on header", () => {
    const h2 = doc.querySelector("#t0 h2");
    expect(h2.id).toBe("x1-foo");
  });

  describe("section links", () => {
    it("adds sections links to introductory sections", () => {
      expect(doc.querySelector(".introductory h2 + a.self-link")).toBeTruthy();
    });

    it("distinguishes between regular sections and appendixes, including ones without a section number", () => {
      const anchor = doc.querySelector(".introductory h2 + a.self-link");
      let ariaLabel = anchor.getAttribute("aria-label");
      expect(ariaLabel).toBe("Permalink for this Section");

      const custom = doc.querySelector("#custom-id + a.self-link");
      ariaLabel = custom.getAttribute("aria-label");
      expect(ariaLabel).toBe("Permalink for Section 3.");

      const appendix = doc.querySelector("#a1 + a.self-link");
      ariaLabel = appendix.getAttribute("aria-label");
      expect(ariaLabel).toBe("Permalink for Appendix A.");

      const deepAppendix = doc.querySelector("#a2 + a.self-link");
      ariaLabel = deepAppendix.getAttribute("aria-label");
      expect(ariaLabel).toBe("Permalink for Appendix A.1");

      // marked as noToc
      const deepH4 = doc.querySelector("h4 + a.self-link");
      ariaLabel = deepH4.getAttribute("aria-label");
      expect(ariaLabel).toBe("Permalink for this Section");
    });

    it("doesn't add sections links when addSectionLinks is false", async () => {
      const ops = makeStandardOps({ addSectionLinks: false }, body);
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("h2 > a.self-link")).toBeFalsy();
    });

    it("add header ids when addSectionLinks is false", async () => {
      const ops = makeStandardOps({ addSectionLinks: false }, body);
      const doc = await makeRSDoc(ops);
      const [h3, h4] = doc.querySelectorAll("#sotd h3, #sotd h4");
      expect(h3.id).toBe("level-3-heading");
      expect(h4.id).toBe("level-4-heading");
    });

    it("adds section links", () => {
      const test1 = doc.querySelector(
        "#test-1 > div.header-wrapper > h2 + a.self-link"
      );
      expect(test1.getAttribute("href")).toBe("#test-1");

      const test2 = doc.querySelector(
        "#pass > div.header-wrapper > h2 + a.self-link"
      );
      expect(test2.getAttribute("href")).toBe("#custom-id");
    });

    it("doesn't add section links to h2s .introductory, but h3, h4s are ok", () => {
      const [h3, h4] = doc.querySelectorAll("#sotd h3, #sotd h4");
      expect(h3.id).toBe("level-3-heading");
      expect(h4.id).toBe("level-4-heading");
    });
  });
});
