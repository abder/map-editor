class Map {
  constructor() {
    this.currentHeight = 10;
    this.currentWidth = 10;
    this.tileWidth = 47;
    this.mapRow = Array(this.currentWidth).fill(Array(2).fill());
    this.map = Array(this.currentHeight).fill(this.mapRow);
    this.currentTileLayer;
    this.currentTileCords = {};
    this.options = [
      {
        layer: 0,
        options: [
          {
            name: "sand",
            src: "images/sand.png",
          },
          {
            name: "grass",
            src: "images/grass.png",
          },
        ],
      },
      {
        layer: 1,
        options: [
          {
            name: "tree",
            src: "images/tree.png",
          },
          {
            name: "barrel",
            src: "images/barrel.png",
          },
        ],
      },
    ];

    // Events
    this.selectTileEvent = new Event();
    this.updateTileEvent = new Event();
    this.initEvent = new Event();
    this.importEvent = new Event();
    this.changeSizeEvent = new Event();
    this.errorAlert = new Event();
  }

  init() {
    this.initEvent.trigger({
      map: this.map,
      mapWidth: this.currentWidth * tileWidth,
    });
  }

  changeLandSize(sizes) {
    const mapWidth = this.map[0].length;
    const mapHeight = this.map.length;
    const diffHeight = Number(sizes.height) - mapHeight;
    const diffWidth = Number(sizes.width) - mapWidth;

    if (diffHeight === 0 && diffWidth === 0) return;

    let newMap = this.map.slice();

    if (diffHeight) {
      if (diffHeight > 0) {
        const row = Array(this.currentWidth).fill(Array(2).fill());
        newMap = newMap.concat(Array(diffHeight).fill(row));
      } else {
        newMap = newMap.slice(0, diffHeight);
      }
      this.map = newMap;
    }

    if (diffWidth) {
      newMap = [];
      if (diffWidth > 0) {
        this.map.forEach((row) => {
          let newRow = row;
          newRow = newRow.concat(Array(diffWidth).fill(Array(2).fill()));
          newMap.push(newRow);
        });
      } else {
        this.map.forEach((row) => {
          let newRow = row;
          newRow = newRow.slice(0, diffWidth);
          newMap.push(newRow);
        });
      }

      this.map = newMap;
    }

    this.currentHeight = Number(sizes.height);
    this.currentWidth = Number(sizes.width);

    this.changeSizeEvent.trigger({
      map: this.map,
      mapWidth: this.currentWidth * this.tileWidth,
    });
  }

  selectTile(cords) {
    this.currentTileCords = cords;

    this.selectTileEvent.trigger({
      row: cords.row,
      column: cords.column,
      options: this.options,
    });
  }

  updateTile(data) {
    const pair =
      this.map[this.currentTileCords.row][this.currentTileCords.column].slice();

    if (!pair[0] && data.layer === 1) {
      this.errorAlert.trigger({ msg: "Choose a ground first!" });
      return;
    }

    let action = "create";

    if (pair[data.layer]) {
      action = "update";
    }

    const row = this.map[this.currentTileCords.row].slice();

    pair[data.layer] = "images/" + data.name + ".png";

    row[this.currentTileCords.column] = pair;

    this.map[this.currentTileCords.row] = row;
    this.updateTileEvent.trigger({
      row: this.currentTileCords.row,
      column: this.currentTileCords.column,
      src: "images/" + data.name + ".png",
      layer: data.layer,
      action,
    });
  }

  import(data) {
    this.map = data.map;
    this.currentWidth = data.map[0].length;
    this.importEvent.trigger({
      map: this.map,
      mapWidth: this.currentWidth * tileWidth,
    });
  }

  export() {
    let data = { map: this.map };

    var json = JSON.stringify(data);

    // Convert JSON string to BLOB.
    json = [json];
    let blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob1);
    let a = document.createElement("a");
    a.download = "map.json";
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
