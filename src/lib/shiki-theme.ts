import type { ThemeRegistration } from "shiki"

export const t3DarkTheme: ThemeRegistration = {
  name: "T3 Dark",
  // Required by Shiki
  fg: "#d2c7e1",
  bg: "transparent",
  colors: {
    "editor.background": "#1d1921",
    foreground: "#d2c7e1",
    "editor.foreground": "#d2c7e1",
    "editorGutter.background": "#1a1419",
    "editorLineNumber.foreground": "#b55487",
  },
  settings: [
    {
      name: "keywords",
      scope: [
        "storage.modifier",
        "storage.type",
        "keyword",
        "punctuation.separator.hash.cs",
        "punctuation.definition.directive",
        "keyword.operator.expression",
        "markup.heading.markdown",
        "markup.deleted.diff",
      ],
      settings: {
        foreground: "#f888b5",
      },
    },
    {
      name: "types",
      scope: [
        "support.type",
        "support.class",
        "entity.name.type",
        "entity.name.namespace",
        "constant.other.table-name",
        "storage.modifier.attribute.swift",
        "entity.other.inherited-class",
        "meta.type-name",
        "variable.other.object.cs",
        "entity.other.attribute-name.class.css",
        "punctuation.definition.list.begin.markdown",
        "support.type.property-name.json",
        "entity.name.tag.yaml",
      ],
      settings: {
        foreground: "#a2dbff",
      },
    },
    {
      name: "string",
      scope: ["string", "markup.inserted.diff"],
      settings: {
        foreground: "#96d0bb",
      },
    },
    {
      name: "preprocessor",
      scope: ["meta.preprocessor", "entity.name.function.preprocessor", "meta.diff.range.unified"],
      settings: {
        foreground: "#ffbc9e",
      },
    },
    {
      name: "function",
      scope: [
        "entity.other.attribute-name",
        "meta.tag.attributes",
        "entity.name.function",
        "function",
        "support.function",
        "meta.function-call",
        "support.function.any-method.swift",
        "markup.inline.raw.string.markdown",
        "markup.quote.markdown",
      ],
      settings: {
        foreground: "#baa4ed",
      },
    },
    {
      name: "tag",
      scope: [
        "constant.language",
        "entity.name.tag",
        "variable.language.self",
        "variable.language.this",
        "variable.parameter.positional",
        "support.constant",
        "constant.other.caps",
        "entity.name.function.decorator",
        "variable.other.normal.shell",
      ],
      settings: {
        foreground: "#e8a5e4",
      },
    },
    {
      name: "value",
      scope: [
        "constant.numeric",
        "entity.name.type.lifetime",
        "meta.scope.logical-expression",
        "constant.other.color",
        "punctuation.definition.constant",
        "constant.other.placeholder",
        "constant.character.entity",
      ],
      settings: {
        foreground: "#ffbc9e",
      },
    },
    {
      name: "variable",
      scope: ["variable", "meta.function-call.swift"],
      settings: {
        foreground: "#f2ebfa",
      },
    },
    {
      name: "delimiters",
      scope: [
        "punctuation.brackets",
        "punctuation.comma",
        "punctuation.semi",
        "keyword.operator",
        "punctuation.definition.parameters",
        "punctuation.definition.interpolation",
        "punctuation.section.parens",
        "punctuation.section.embedded",
        "meta.parens",
        "support.type.property-name",
        "punctuation.definition.arguments",
        "constant.character.format.placeholder",
        "punctuation.definition.logical-expression.shell",
        "punctuation.definition.variable.shell",
      ],
      settings: {
        foreground: "#d2c7e1",
      },
    },
    {
      name: "comment",
      scope: ["comment", "punctuation.definition.comment", "meta.diff.header"],
      settings: {
        fontStyle: "italic",
        foreground: "#7a6483",
      },
    },
    {
      name: "italic",
      scope: ["markup.italic.markdown"],
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "bold",
      scope: ["markup.bold.markdown"],
      settings: {
        fontStyle: "bold",
      },
    },
    {
      name: "strikethrough",
      scope: ["markup.strikethrough.markdown"],
      settings: {
        fontStyle: "strikethrough",
      },
    },
  ],
  type: "dark",
}

export const t3LightTheme: ThemeRegistration = {
  name: "T3 Light",
  bg: "transparent",
  fg: "#673c8b",
  colors: {
    "editor.background": "#f5edfa",
    foreground: "#673c8b",
    "editor.foreground": "#673c8b",
    "editorGutter.background": "#f2def5",
    "editorLineNumber.foreground": "#b55487",
  },

  settings: [
    {
      name: "keywords",
      scope: [
        "storage.modifier",
        "storage.type",
        "keyword",
        "punctuation.separator.hash.cs",
        "punctuation.definition.directive",
        "keyword.operator.expression",
        "markup.heading.markdown",
        "markup.deleted.diff",
      ],
      settings: {
        foreground: "#c51478",
      },
    },
    {
      name: "types",
      scope: [
        "support.type",
        "support.class",
        "entity.name.type",
        "entity.name.namespace",
        "constant.other.table-name",
        "storage.modifier.attribute.swift",
        "entity.other.inherited-class",
        "meta.type-name",
        "variable.other.object.cs",
        "entity.other.attribute-name.class.css",
        "punctuation.definition.list.begin.markdown",
        "support.type.property-name.json",
        "entity.name.tag.yaml",
      ],
      settings: {
        foreground: "#5579bc",
      },
    },
    {
      name: "string",
      scope: ["string", "markup.inserted.diff"],
      settings: {
        foreground: "#487e70",
      },
    },
    {
      name: "preprocessor",
      scope: ["meta.preprocessor", "entity.name.function.preprocessor", "meta.diff.range.unified"],
      settings: {
        foreground: "#d2626c",
      },
    },
    {
      name: "function",
      scope: [
        "entity.other.attribute-name",
        "meta.tag.attributes",
        "entity.name.function",
        "function",
        "support.function",
        "meta.function-call",
        "support.function.any-method.swift",
        "markup.inline.raw.string.markdown",
        "markup.quote.markdown",
      ],
      settings: {
        foreground: "#6c4cbc",
      },
    },
    {
      name: "tag",
      scope: [
        "constant.language",
        "entity.name.tag",
        "variable.language.self",
        "variable.language.this",
        "variable.parameter.positional",
        "support.constant",
        "constant.other.caps",
        "entity.name.function.decorator",
        "variable.other.normal.shell",
      ],
      settings: {
        foreground: "#b74cbb",
      },
    },
    {
      name: "value",
      scope: [
        "constant.numeric",
        "entity.name.type.lifetime",
        "meta.scope.logical-expression",
        "constant.other.color",
        "punctuation.definition.constant",
        "constant.other.placeholder",
        "constant.character.entity",
      ],
      settings: {
        foreground: "#d2626c",
      },
    },
    {
      name: "variable",
      scope: ["variable", "meta.function-call.swift"],
      settings: {
        foreground: "#563271",
      },
    },
    {
      name: "delimiters",
      scope: [
        "punctuation.brackets",
        "punctuation.comma",
        "punctuation.semi",
        "keyword.operator",
        "punctuation.definition.parameters",
        "punctuation.definition.interpolation",
        "punctuation.section.parens",
        "punctuation.section.embedded",
        "meta.parens",
        "support.type.property-name",
        "punctuation.definition.arguments",
        "constant.character.format.placeholder",
        "punctuation.definition.logical-expression.shell",
        "punctuation.definition.variable.shell",
      ],
      settings: {
        foreground: "#673c8b",
      },
    },
    {
      name: "comment",
      scope: ["comment", "punctuation.definition.comment", "meta.diff.header"],
      settings: {
        fontStyle: "italic",
        foreground: "#a289a9",
      },
    },
    {
      name: "italic",
      scope: ["markup.italic.markdown"],
      settings: {
        fontStyle: "italic",
      },
    },
    {
      name: "bold",
      scope: ["markup.bold.markdown"],
      settings: {
        fontStyle: "bold",
      },
    },
    {
      name: "strikethrough",
      scope: ["markup.strikethrough.markdown"],
      settings: {
        fontStyle: "strikethrough",
      },
    },
  ],
  type: "light",
}
