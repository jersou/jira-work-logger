#!/usr/bin/env -S deno run -A

import { cliteRun } from "@jersou/clite";
import {JiraWorkLogger} from "./backend/server.ts";

cliteRun(JiraWorkLogger, { meta: import.meta });
