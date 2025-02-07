import { appName } from "@lib/constants";
import React from "react";

const siteAuthors = ["Comrade Fund", "Comrade Bits", "ComradeCosmo", "Tim"];
const copyrightYear = new Date().getFullYear().toString();

export default function Footer() {
  return (
    <footer className="mx-auto text-center mt-32 py-4">
      <ul className="flex justify-center flex-wrap">
        {siteAuthors.map((author, index) => (
          <React.Fragment key={author}>
            <li>{author}</li>
            {/* bullet separator if not last */}
            {index < siteAuthors.length - 1 && (
              <li role="presentation" className="px-2">
                &bull;
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
      <p className="mt-4">
        &copy; {copyrightYear} {appName}
      </p>
    </footer>
  );
}
