export type JsonObject = {[Key in string]: Json} & {[Key in string]?: Json | undefined};

export type JsonArray = Json[] | readonly Json[];

export type JsonPrimitive = string | number | boolean | null;

export type Json = JsonPrimitive | JsonObject | JsonArray;

