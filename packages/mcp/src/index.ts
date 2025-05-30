// :A: tldr MCP server stub for future Grepa MCP server implementation
// :A: todo implement MCP server functionality

export interface McpServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  port?: number;
}

export function createMcpServer(): McpServer {
  // :A: todo implement actual MCP server
  throw new Error('MCP server not yet implemented');
}