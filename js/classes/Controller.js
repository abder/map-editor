class Controller {
  constructor() {
    this.view = new View();
    this.model = new Map();

    this.model.initEvent.addListener((data) => {
      this.view.render(data);
    });

    this.view.selectTileEvent.addListener((index) => {
      this.model.selectTile(index);
    });

    this.view.selectOptionEvent.addListener((optionName) => {
      this.model.updateTile(optionName);
    });

    this.model.selectTileEvent.addListener((options) => {
      this.view.selectTile(options);
    });

    this.model.updateTileEvent.addListener((data) => {
      this.view.updateTile(data);
    });

    this.view.exportEvent.addListener(() => {
      this.model.export();
    });

    this.view.importEvent.addListener((data) => {
      this.model.import(data);
    });

    this.model.importEvent.addListener((data) => {
      this.view.render(data);
    });

    this.model.changeSizeEvent.addListener((data) => {
      this.view.render(data);
    });

    this.view.changeSizeEvent.addListener((data) => {
      this.model.changeLandSize(data);
    });

    this.model.errorAlert.addListener((data) => {
      this.view.errorAlert(data);
    });
  }

  run() {
    this.model.init();
  }
}
