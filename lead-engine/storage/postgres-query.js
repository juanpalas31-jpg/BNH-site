/**
 * Provider-neutral query bridge factory.
 * A concrete deployment supplies execute(sql, params) from its PostgreSQL provider.
 * Keeping this injection point avoids coupling Spider Engine to one vendor SDK.
 */
export function createQueryBridge(execute) {
  if (typeof execute !== 'function') throw new Error('PostgreSQL execute function required');
  return async (sql, params = []) => {
    const result = await execute(sql, params);
    if (!result) throw new Error('Empty PostgreSQL response');
    return result;
  };
}
