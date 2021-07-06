declare module NodeJS {
  interface Global {
    /**
     * 取消裁剪
     */
    cancelShortCut: Function;
    /**
     * 撤销裁剪
     */
    refreshShortCut: Function;
    /**
     * 保存裁剪图片
     */
    sendFileToMac: (context: CanvasRenderingContext2D) => void;
    /**
     * 下载裁剪图片
     */
    downloadShortCut: (context: CanvasRenderingContext2D) => void;
    /**
     * 开始编辑裁剪内容
     */
    startEditCanvas: Function;
  }
}
