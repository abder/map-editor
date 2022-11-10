class View {
  constructor() {
    this.selectTileEvent = new Event();
    this.selectOptionEvent = new Event();
    this.changeSizeEvent = new Event();
    this.exportEvent = new Event();
    this.initEvent = new Event();
    this.importEvent = new Event();

    this.$options = document.createElement("div");
    this.$app = document.getElementById("app");
    this.$land = document.getElementById("land");
    this.$export = document.getElementById("export");
    this.$import = document.getElementById("import");
    this.$sizeForm = document.getElementById("size-form");

    // Export Event
    this.$export.addEventListener("click", () => {
      this.exportEvent.trigger(this.$export);
    });

    // Import event
    this.$import.addEventListener("change", (event) => {
      let reader = new FileReader();

      reader.onload = (event) => {
        let jsonObj = JSON.parse(event.target.result);
        this.importEvent.trigger(jsonObj);
      };

      reader.readAsText(event.target.files[0]);
      this.$import.value = "";
    });

    // Change size event
    this.$sizeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const width = document.getElementById("width").value;
      const height = document.getElementById("height").value;

      this.changeSizeEvent.trigger({ width, height });
    });
  }

  render(data) {
    this.deselect();
    this.$land.innerHTML = "";

    // Set Land width
    this.$land.style.width = data.mapWidth + "px";

    data.map.map((row, i) => {
      row.map((column, j) => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("data-row", i);
        tile.setAttribute("data-column", j);

        tile.addEventListener("click", () => {
          this.selectTileEvent.trigger({ row: i, column: j });
        });

        // import images
        if (column[0]) {
          this.updateTile(
            { row: i, column: j, layer: 0, src: column[0] },
            tile
          );
        }

        if (column[1]) {
          this.updateTile(
            { row: i, column: j, layer: 1, src: column[1] },
            tile
          );
        }

        this.$land.appendChild(tile);
      });
    });

    this.$options.className = "options";
    this.$app.appendChild(this.$options);
    this.$app.appendChild(this.$land);
  }

  selectTile(data) {
    this.deselect();

    const $tile = document.querySelector(
      `[data-row="${data.row}"][data-column="${data.column}"]`
    );
    // lighten the tile
    $tile.classList.add("light-tile");

    this.displayOptions(data.options);
  }

  deselect() {
    // Draken existing lighten tile
    const $lightedTiles = document.getElementsByClassName("light-tile");
    if ($lightedTiles.length > 0)
      $lightedTiles[0].classList.remove("light-tile");

    this.hideOptions();
  }

  updateTile(data, tileEl) {
    console.log(data);
    let $tile;

    if (tileEl) {
      $tile = tileEl;
    } else {
      $tile = document.querySelector(
        `[data-row="${data.row}"][data-column="${data.column}"]`
      );
    }

    let $img;

    if (data.action === "update") {
      $img = $tile.querySelector(`img[data-layer="${data.layer}"]`);
      console.log($img);
      $img.src = data.src;
    } else {
      $img = document.createElement("img");
      $img.src = data.src;
      $img.setAttribute("data-layer", data.layer);

      if (data.layer == 1) {
        $img.className = "image-top-layer";
      }

      $tile.appendChild($img);
    }
  }

  errorAlert(data) {
    alert(data.msg);
  }

  hideOptions() {
    this.$options.innerHTML = "";
  }

  displayOptions(options) {
    console.log(options);
    this.hideOptions();

    options.forEach((el) => {
      el.options.map((option) => {
        const $img = document.createElement("img");
        $img.id = option.name;
        $img.src = option.src;
        $img.addEventListener("click", () => {
          this.selectOptionEvent.trigger({
            name: option.name,
            layer: el.layer,
          });
        });
        this.$options.appendChild($img);
      });
    });
  }
}
