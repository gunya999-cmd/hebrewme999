import { checkOrigin, json, liveModel, voiceAccess, type MiriamContext } from "../../server/miriamSecurity";

// Only public connection metadata is returned. The permanent key stays in env.
export async function onRequestGet(context: MiriamContext): Promise<Response> {
  const denied = checkOrigin(context.request) || await voiceAccess(context);
  if (denied) return denied;
  return json({ model: liveModel(context.env) });
}
