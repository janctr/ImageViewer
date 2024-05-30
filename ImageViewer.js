define(['qlik', 'text!./index.html', 'css!./index.css'], function (
    qlik,
    template
) {
    function getNumImages(layout) {
        return (imageUrls = layout.qHyperCube.qDataPages[0].qMatrix.length);
    }

    function getImageUrls(layout) {
        return layout.qHyperCube.qDataPages[0].qMatrix.map(
            (cell) => cell[0].qText
        );
    }

    return {
        template: template,
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [
                    {
                        qWidth: 2,
                        qHeight: 50,
                    },
                ],
            },
        },
        definition: {
            type: 'items',
            component: 'accordion',
            items: {
                imageViewerDimensions: {
                    type: 'items',
                    component: 'expandable-items',
                    label: 'Image Viewer Dimensions',
                    translation: 'Image Viewer Dimensions',
                    ref: 'imageViewerDimensions',
                    items: {
                        keyDimension: {
                            type: 'string',
                            ref: 'imageViewerDimensions.keyDimension',
                            label: 'Key Dimension',
                            defaultValue: '',
                            expression: 'optional',
                        },
                        imageDimension: {
                            type: 'string',
                            ref: 'imageViewerDimensions.imageDimension',
                            label: 'Image Dimension',
                            defaultValue: '',
                            expression: 'optional',
                        },
                    },
                },
                dimensions: {
                    uses: 'dimensions',
                    min: 1,
                    max: 1,
                },
                sorting: {
                    uses: 'sorting',
                },
                settings: {
                    uses: 'settings',
                    items: {
                        initFetchRows: {
                            ref: 'qHyperCubeDef.qInitialDataFetch.0.qHeight',
                            label: 'Initial fetch rows',
                            type: 'number',
                            defaultValue: 1,
                        },
                    },
                },
            },
        },
        support: {
            snapshot: true,
            export: true,
            exportData: false,
        },
        paint: function ($element, layout) {
            return qlik.Promise.resolve();
        },
        controller: [
            '$scope',
            function ($scope) {
                //add your rendering code here
                $scope.html = 'Hello World';

                $scope.currentIndex = 0;
                $scope.numImages = getNumImages($scope.layout);
                $scope.imageUrls = getImageUrls($scope.layout);

                $scope.prevImage = function () {
                    console.log('Previous image');

                    let newIndex = $scope.currentIndex - 1;
                    if (newIndex < 0) {
                        newIndex = $scope.numImages - 1;
                    }

                    $scope.currentIndex = newIndex;
                };

                $scope.nextImage = function () {
                    console.log('Next image');

                    let newIndex = $scope.currentIndex + 1;

                    if (newIndex >= $scope.numImages) {
                        newIndex = 0;
                    }

                    $scope.currentIndex = newIndex;
                };

                $scope.component.model.Validated.bind(function () {
                    console.info('Validated: ', $scope.layout.qHyperCube);

                    $scope.currentIndex = 0;
                    $scope.numImages = getNumImages($scope.layout);
                    $scope.imageUrls = getImageUrls($scope.layout);
                });
            },
        ],
    };
});
