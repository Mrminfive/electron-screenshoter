import { WebContents } from 'electron';
import { initMain, close } from '../../src/main';
import { ScreenshotEvent } from '../../src/share/constant';

describe('Test main module', () => {
  let currentEventName = '';

  const mockRendererWebContents = {
    send(eventName: string) {
      currentEventName = eventName;
    }
  } as WebContents;

  test('initMain', () => {
    initMain(mockRendererWebContents);
  });

  test('close', async () => {
    expect(currentEventName).not.toBe(ScreenshotEvent.Close);
    close();
    expect(currentEventName).toBe(ScreenshotEvent.Close);
  });
});
