export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "mysql",
} satisfies {
  schema: string;
  out: string;
  dialect: "mysql";
};
