const snippets = require("./schemas/snippets.json");
const tdSchema = require("./schemas/TD.schema.json");
const tmSchema = require("./schemas/TM.schema.json");
const pointer = require("jsonpointer");
const fs = require("fs");

buildSchema(tdSchema, snippets,"./schemas/TD.schema.json");
buildSchema(tmSchema, snippets,"./schemas/TM.schema.json");

fs.writeFileSync("./schemas/TD.schema.json", JSON.stringify(tdSchema, null, 4));
fs.writeFileSync("./schemas/TM.schema.json", JSON.stringify(tmSchema, null, 2));

function buildSchema(schema,snippets,file) {
    const filteredSnippets = snippets.filter(snippet =>  !snippet.file || snippet.file === file);
    for (const snippet of filteredSnippets) {
        const element = pointer.get(schema, snippet.location);
        if (!element) {
            throw new Error(`${snippet.location} not found`);
        }
        const snippetClone = JSON.parse(JSON.stringify(snippet));
        delete snippetClone.location;
        delete snippetClone.file;
        element["defaultSnippets"] = element["defaultSnippets"] || [];
        element["defaultSnippets"].push(snippetClone);
    }    
}