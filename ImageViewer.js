define(['qlik', 'text!./index.html', 'css!./index.css'], function (
    qlik,
    template
) {
    function render(layout) {
        const imageUrls = layout.qHyperCube.qDataPages[0].qMatrix.map(
            (cell) => cell[0].qText
        );

        console.log('imageUrls: ', imageUrls);

        if (imageUrls.length > 0) {
            $('.image-viewer-box').css(
                'background-image',
                `url(${imageUrls[0]})`
            );
        }
    }

    function changeImage(currentIndex, layout, direction) {
        const imageUrls = layout.qHyperCube.qDataPages[0].qMatrix.map(
            (cell) => cell[0].qText
        );

        const newIndex = currentIndex + direction;

        if (newIndex >= imageUrls.length || newIndex < 0) {
            // Don't do anything
            console.log('newIndex: ', newIndex);
            console.log('imageUrls.length: ', imageUrls.length);
            console.log('returning -1');
            return -1;
        }

        if (imageUrls.length > 0) {
            $('.image-viewer-box').css(
                'background-image',
                `url(${imageUrls[newIndex]})`
            );

            console.log('success. changed to url: ', imageUrls[newIndex]);

            return 1;
        } else {
            console.log('ERROR change image');
            console.log('balls');
            return -1;
        }
    }

    function setImages(layout) {
        // Flush previous images
        $('.image-wrapper').remove();

        const imageUrls = layout.qHyperCube.qDataPages[0].qMatrix.map(
            (cell) => cell[0].qText
        );

        if (imageUrls.length > 0) {
            const images = imageUrls.map((url) =>
                $(`
                <div class="image-wrapper">
                    <img src="${url}"/>
                </div>
            `)
            );
            $('.image-viewer-box').append(images);
        }
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
            console.log('layout changed: ', layout);
            console.log('new data: ', layout.qHyperCube.qDataPages);

            // render(layout);
            setImages(layout);

            return qlik.Promise.resolve();
        },
        controller: [
            '$scope',
            function ($scope) {
                //add your rendering code here
                $scope.html = 'Hello World';
                const layout = $scope.layout;

                $scope.currentIndex = 0;
                $scope.prevImage = function () {
                    console.log('Previous image');
                    const result = changeImage($scope.currentIndex, layout, -1);
                    if (result > 0)
                        $scope.currentIndex = $scope.currentIndex - 1;
                };
                $scope.nextImage = function () {
                    console.log('Next image');
                    const result = changeImage($scope.currentIndex, layout, 1);
                    if (result > 0)
                        $scope.currentIndex = $scope.currentIndex + 1;
                };
            },
        ],
    };
});
