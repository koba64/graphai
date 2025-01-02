import { AgentFunction, AgentFunctionInfo } from "graphai";
export declare const copyMessageAgent: AgentFunction<{
    count: number;
    message: string;
}, {
    messages: string[];
}>;
declare const copyMessageAgentInfo: AgentFunctionInfo;
export default copyMessageAgentInfo;
