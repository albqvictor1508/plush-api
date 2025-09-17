export const chatConnections: Record<string, Set<WebSocket>> = {};

export const addConnection = async (chatId: string, ws: WebSocket) => {
	if (!chatConnections[chatId]) chatConnections[chatId] = new Set(); //upsert
	chatConnections[chatId].add(ws);
};

export const removeConnection = async (chatId: string, ws: WebSocket) => {
	if (!chatConnections[chatId]) throw new Error("this connection not exists"); //WARN: tratar erro
	if (!chatConnections[chatId]?.has(ws)) throw new Error("error"); //WARN: tratar erro
	chatConnections[chatId].delete(ws);
};
