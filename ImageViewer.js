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

    function formatDescription(description) {
        description = description.replace('<italic>', '<em>');
        description = description.replace('</italic>', '</em>');

        description = description.replace('<bold>', '<b>');
        description = description.replace('</bold>', '</b>');

        description = description.replace('<underline>', '<u>');
        description = description.replace('</underline>', '</u>');

        ['red', 'blue', 'orange'].forEach((color) => {
            description = description.replace(
                `<${color}>`,
                `<span style="color: ${color} !important;">`
            );
            description = description.replace(`</${color}>`, '</span>');
        });

        return description;
    }

    function getImages(layout) {
        console.log('layout: ', layout);

        const indexes = {
            imageUrlDimension: 0,
            imageTitleDimension: 1,
            imageDescriptionDimension: 2,
        };

        const {
            qHyperCube: { qDimensionInfo },
        } = layout;

        [
            'imageUrlDimension',
            'imageTitleDimension',
            'imageDescriptionDimension',
        ].forEach((dim) => {
            if (!layout.imageViewerDimensions) return;

            if (layout.imageViewerDimensions[dim]) {
                indexes[dim] = qDimensionInfo.findIndex(
                    (column) =>
                        column.qFallbackTitle ===
                        layout.imageViewerDimensions[dim]
                );
            }
        });

        return layout.qHyperCube.qDataPages[0].qMatrix.map((row) => ({
            imageUrl: row[indexes.imageUrlDimension]?.qText,
            imageTitle: row[indexes.imageTitleDimension]?.qText,
            // imageDescription:
            //     'Lorem <bold>ipsum dolor sit amet</bold>, <italic><red>consectetur</red></italic> adipiscing elit. <underline><red>Morbi varius</red> <blue>massa non</blue> <orange>enim pellentesque</orange></underline>, at laoreet tellus gravida. Morbi pulvinar libero lacus, id ullamcorper nisl efficitur ac. Vestibulum eros magna, ornare non placerat at, imperdiet a velit. Pellentesque sodales mauris id faucibus maximus. Aliquam vulputate dictum est vel tristique. Integer condimentum sapien sed aliquam elementum. Vestibulum nec convallis enim. Maecenas eget aliquam nunc. Ut congue diam dolor, a convallis leo suscipit in. Aliquam erat volutpat. Morbi ut quam eu magna mattis hendrerit. Proin nec turpis tincidunt, viverra orci id, fermentum risus. Maecenas quis quam a elit egestas commodo in at risus. Etiam tristique ligula eget diam convallis lobortis.',
            imageDescription: row[indexes.imageDescriptionDimension]?.qText,
        }));
    }

    return {
        template: template,
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [
                    {
                        qWidth: 3,
                        qHeight: 1000,
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
                        imageUrlDimension: {
                            type: 'string',
                            ref: 'imageViewerDimensions.imageUrlDimension',
                            label: 'Image URL Dimension',
                            defaultValue: '',
                            expression: 'optional',
                        },
                        imageTitleDimension: {
                            type: 'string',
                            ref: 'imageViewerDimensions.imageTitleDimension',
                            label: 'Image Title Dimension',
                            defaultValue: '',
                            expression: 'optional',
                        },
                        imageDescriptionDimension: {
                            type: 'string',
                            ref: 'imageViewerDimensions.imageDescriptionDimension',
                            label: 'Image Description Dimension',
                            defaultValue: '',
                            expression: 'optional',
                        },
                    },
                },
                dimensions: {
                    uses: 'dimensions',
                    min: 1,
                    max: 3,
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
                $scope.isFullscreen = false;
                $scope.toggleFullscreen = function () {
                    $scope.isFullscreen = !$scope.isFullscreen;
                };

                $scope.formatDescription = formatDescription;
                $scope.currentIndex = 0;
                $scope.numImages = getNumImages($scope.layout);
                $scope.imageUrls = getImageUrls($scope.layout);
                $scope.images = getImages($scope.layout);

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
                    $scope.images = getImages($scope.layout);

                    console.log('images: ', $scope.images);
                });
            },
        ],
    };
});
