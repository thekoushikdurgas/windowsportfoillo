export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapZone {
  x: number;
  y: number;
  width: number;
  height: number;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export class WindowManagementService {
  private snapZones: SnapZone[] = [];
  private snapThreshold = 50;
  private screenWidth = 1920;
  private screenHeight = 1080;

  constructor() {
    this.initializeSnapZones();
  }

  private initializeSnapZones() {
    const halfWidth = this.screenWidth / 2;
    const halfHeight = this.screenHeight / 2;

    this.snapZones = [
      // Left half
      {
        x: 0,
        y: 0,
        width: halfWidth,
        height: this.screenHeight,
        position: 'left',
      },
      // Right half
      {
        x: halfWidth,
        y: 0,
        width: halfWidth,
        height: this.screenHeight,
        position: 'right',
      },
      // Top half
      {
        x: 0,
        y: 0,
        width: this.screenWidth,
        height: halfHeight,
        position: 'top',
      },
      // Bottom half
      {
        x: 0,
        y: halfHeight,
        width: this.screenWidth,
        height: halfHeight,
        position: 'bottom',
      },
      // Center (quarter windows)
      {
        x: 0,
        y: 0,
        width: halfWidth,
        height: halfHeight,
        position: 'center',
      },
    ];
  }

  updateScreenSize(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
    this.initializeSnapZones();
  }

  checkSnapPosition(x: number, y: number, width: number, height: number): SnapZone | null {
    for (const zone of this.snapZones) {
      if (this.isInSnapZone(x, y, width, height, zone)) {
        return zone;
      }
    }
    return null;
  }

  private isInSnapZone(x: number, y: number, width: number, height: number, zone: SnapZone): boolean {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const zoneCenterX = zone.x + zone.width / 2;
    const zoneCenterY = zone.y + zone.height / 2;

    const distanceX = Math.abs(centerX - zoneCenterX);
    const distanceY = Math.abs(centerY - zoneCenterY);

    return distanceX < this.snapThreshold && distanceY < this.snapThreshold;
  }

  getSnapPosition(zone: SnapZone): WindowPosition {
    switch (zone.position) {
      case 'left':
        return {
          x: 0,
          y: 0,
          width: this.screenWidth / 2,
          height: this.screenHeight,
        };
      case 'right':
        return {
          x: this.screenWidth / 2,
          y: 0,
          width: this.screenWidth / 2,
          height: this.screenHeight,
        };
      case 'top':
        return {
          x: 0,
          y: 0,
          width: this.screenWidth,
          height: this.screenHeight / 2,
        };
      case 'bottom':
        return {
          x: 0,
          y: this.screenHeight / 2,
          width: this.screenWidth,
          height: this.screenHeight / 2,
        };
      case 'center':
        return {
          x: this.screenWidth / 4,
          y: this.screenHeight / 4,
          width: this.screenWidth / 2,
          height: this.screenHeight / 2,
        };
      default:
        return {
          x: 0,
          y: 0,
          width: this.screenWidth,
          height: this.screenHeight,
        };
    }
  }

  createTileLayout(windows: Array<{ id: string; position: WindowPosition }>): Array<{ id: string; position: WindowPosition }> {
    const tiledWindows = [...windows];
    const tileCount = tiledWindows.length;

    if (tileCount === 0) return tiledWindows;

    // Simple tiling algorithm
    if (tileCount === 1) {
      if (tiledWindows[0]) {
        tiledWindows[0].position = {
          x: 0,
          y: 0,
          width: this.screenWidth,
          height: this.screenHeight,
        };
      }
    } else if (tileCount === 2) {
      if (tiledWindows[0]) {
        tiledWindows[0].position = {
          x: 0,
          y: 0,
          width: this.screenWidth / 2,
          height: this.screenHeight,
        };
      }
      if (tiledWindows[1]) {
        tiledWindows[1].position = {
          x: this.screenWidth / 2,
          y: 0,
          width: this.screenWidth / 2,
          height: this.screenHeight,
        };
      }
    } else if (tileCount <= 4) {
      const cols = 2;
      const rows = Math.ceil(tileCount / cols);
      const cellWidth = this.screenWidth / cols;
      const cellHeight = this.screenHeight / rows;

      tiledWindows.forEach((window, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        window.position = {
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        };
      });
    } else {
      // For more than 4 windows, use a grid layout
      const cols = Math.ceil(Math.sqrt(tileCount));
      const rows = Math.ceil(tileCount / cols);
      const cellWidth = this.screenWidth / cols;
      const cellHeight = this.screenHeight / rows;

      tiledWindows.forEach((window, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        window.position = {
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        };
      });
    }

    return tiledWindows;
  }

  createCascadeLayout(windows: Array<{ id: string; position: WindowPosition }>): Array<{ id: string; position: WindowPosition }> {
    const cascadeOffset = 30;
    const baseWidth = 800;
    const baseHeight = 600;

    return windows.map((window, index) => ({
      ...window,
      position: {
        x: index * cascadeOffset,
        y: index * cascadeOffset,
        width: baseWidth,
        height: baseHeight,
      },
    }));
  }

  createStackLayout(windows: Array<{ id: string; position: WindowPosition }>): Array<{ id: string; position: WindowPosition }> {
    const stackOffset = 20;
    const baseWidth = 800;
    const baseHeight = 600;

    return windows.map((window, index) => ({
      ...window,
      position: {
        x: index * stackOffset,
        y: index * stackOffset,
        width: baseWidth,
        height: baseHeight,
      },
    }));
  }

  minimizeAll(windows: Array<{ id: string; isMinimized: boolean }>): Array<{ id: string; isMinimized: boolean }> {
    return windows.map(window => ({
      ...window,
      isMinimized: true,
    }));
  }

  maximizeAll(windows: Array<{ id: string; isMaximized: boolean }>): Array<{ id: string; isMaximized: boolean }> {
    return windows.map(window => ({
      ...window,
      isMaximized: true,
    }));
  }

  closeAll(): Array<{ id: string }> {
    return [];
  }
}

// Singleton instance
export const windowManagement = new WindowManagementService();
