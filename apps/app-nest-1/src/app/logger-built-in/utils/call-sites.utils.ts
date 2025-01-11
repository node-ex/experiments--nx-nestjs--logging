import { DEFAULT_CALL_SITES_STACK_LEVEL } from '../constants/custom-console-logger.constants';

export class CallSitesUtils {
  /**
   * Code copied from:
   * https://github.com/sindresorhus/callsites/blob/main/index.js
   */
  static getCallSites(): NodeJS.CallSite[] {
    const _prepareStackTrace = Error.prepareStackTrace;
    try {
      let result: NodeJS.CallSite[] = [];
      Error.prepareStackTrace = (_, callSites) => {
        const callSitesWithoutCurrent = callSites.slice(1);
        result = callSitesWithoutCurrent;
        return callSitesWithoutCurrent;
      };

      new Error().stack;
      return result;
    } finally {
      Error.prepareStackTrace = _prepareStackTrace;
    }
  }

  /**
   * Its useless to return exact file name, because NestJS is bundled using
   * Webpack, even when using development server. So file paths from src/
   * folder are not preserved.
   */
  static getCodeLocation(stackLevel = DEFAULT_CALL_SITES_STACK_LEVEL): string {
    const fileName =
      this.getCallSites()[stackLevel]?.getFileName() ??
      this.getCallSites()[stackLevel]?.getEvalOrigin();

    return fileName ? 'app' : 'framework';
  }

  static getTypeName(stackLevel = DEFAULT_CALL_SITES_STACK_LEVEL): string {
    return this.getCallSites()[stackLevel]?.getTypeName() ?? '';
  }

  static getCallableName(stackLevel = DEFAULT_CALL_SITES_STACK_LEVEL): string {
    return (
      this.getCallSites()[stackLevel]?.getFunctionName() ??
      this.getCallSites()[stackLevel]?.getMethodName() ??
      ''
    );
  }
}
