let project = {
    table: $('#table'),
    dinamic: $('.dinamic'),
    mousePositionX: 0,
    mousePositionY: 0,
    mouseNewPositionX: 0,
    mouseNewPositionY: 0,
    topShift: [],
    bottomShift: [],
    topRow: null,
    topCell: null,

    initDivs: () => {
        html = '';

        for(let i = 1; i <= 19; i++) {
            html = '<div class="cell dinamicCell" data-id="' + i + '">-</div>';

            project.dinamic.append(html);
        }
    },

    drawSelect: () => {
        let shiftPressed = false,
            ctrlPressed = false;

        $(document).on('keydown', (event) => {
            if(event.which === 16 && !shiftPressed) {
                shiftPressed = true;
            }
            if(event.which === 17 && !ctrlPressed) {
                ctrlPressed = true;
            }
        });

        $(document).on('keyup', (event) => {
            if(event.which === 16) {
                shiftPressed = false;
            }
            if(event.which === 17) {
                ctrlPressed = false;
            }
        });

        $(document).on('click', '#table .dinamicCell', (event) => {
            let cells = $(event.target);

            if(!shiftPressed && !ctrlPressed) {
                project.deleteSelected();
                cells.addClass('selected');
            } else if(shiftPressed) {
                cells.addClass('selected');
                let cell = JSON.parse(localStorage.getItem('local')),
                    lastItem = cell.length - 2,
                    startRowId = +cell[lastItem].rowDataId,
                    startCellId = +cell[lastItem].cellDataId,
                    endRowId = +cells.closest('.row').attr('data-id'),
                    endCellId = +cells.attr('data-id'),
                    dinamicCell = $('.dinamicCell');

                $.each(dinamicCell, (key, value) => {
                    let valCellId = +$(value).attr('data-id'),
                        valRowId = +$(value).closest('.row').attr('data-id');

                    switch (true) {
                        case valCellId >= endCellId && valRowId === endRowId && endRowId < startRowId || valRowId > endRowId && valRowId < startRowId || valCellId <= startCellId && valRowId === startRowId && endRowId < startRowId:
                            $(value).addClass('selected');
                            project.topShift.push([valRowId, valCellId]);
                            let arr1 = project.bottomShift.slice();

                            for(let i = 0; i < arr1.length; i++) {
                                let topRow = arr1[i][0],
                                    topCell = arr1[i][1];

                                $(project.getCell(topRow, topCell)).removeClass('selected');
                            }
                            break;
                        case valCellId <= endCellId && valRowId === endRowId && startRowId < endRowId || valRowId > startRowId && valRowId < endRowId || valCellId >= startCellId && valRowId === startRowId && startRowId < endRowId:
                            $(value).addClass('selected');
                            project.bottomShift.push([valRowId, valCellId]);
                            let arr2 = project.topShift.slice();

                            for(let i = 0; i < arr2.length; i++) {
                                let topRow = arr2[i][0],
                                    topCell = arr2[i][1];

                                $(project.getCell(topRow, topCell)).removeClass('selected');
                            }
                            break;
                        case valRowId === endRowId && valCellId > endCellId && valCellId < startCellId || valRowId === endRowId && valCellId >startCellId && valCellId < endCellId:
                            $(value).addClass('selected');
                            break;
                    }
                });
            } else if(ctrlPressed) {
                cells.addClass('selected');
            }

        });

        project.table.mousedown((e1) => {
            project.mousePositionX = e1.pageX;
            project.mousePositionY = e1.pageY;
            html = '<div class="selectDiv"></div>';
            project.table.append(html);

            project.table.mousemove((event) => {
                project.mouseNewPositionX = event.pageX;
                project.mouseNewPositionY = event.pageY;

                let div = $('.selectDiv'),
                    divWidth = project.mouseNewPositionX - project.mousePositionX,
                    divHeight = project.mouseNewPositionY - project.mousePositionY,
                    divTop = project.mouseNewPositionY - project.table.offset().top,
                    divLeft = project.mouseNewPositionX - project.table.offset().left,
                    divRight = Math.abs((project.mouseNewPositionX - project.table.offset().left) - project.table.width()),
                    divBottom = Math.abs((project.mouseNewPositionY - project.table.offset().top) - project.table.height());

                div.css('width', Math.abs(divWidth));
                div.css('height', Math.abs(divHeight));
                if(project.mouseNewPositionX < project.mousePositionX) {
                    div.css('left', divLeft);
                }
                if(project.mouseNewPositionX > project.mousePositionX) {
                    div.css('right', divRight);
                }
                if(project.mouseNewPositionY < project.mousePositionY) {
                    div.css('top', divTop);
                }
                if(project.mouseNewPositionY > project.mousePositionY) {
                    div.css('bottom', divBottom);
                }
            });
        });

        project.table.mouseup((e2) => {
            if(!ctrlPressed && !shiftPressed) {
                project.deleteSelected();
            }
            let endPositionX = e2.pageX,
                endPositionY = e2.pageY,
                dinamicCell = $('.dinamicCell'),
                local = JSON.parse(localStorage.getItem('local')),
                cellDataid = $(e2.target).attr('data-id'),
                rowDataId = $(e2.target).closest('.row').attr('data-id');

            if(!local) {
                local = [];
            }

            local.push({
                rowDataId: rowDataId,
                cellDataId: cellDataid
            });

            localStorage.setItem('local', JSON.stringify(local));

            $.each(dinamicCell, (key, value) => {
                let cellTop = $(value).position().top,
                    cellLeft = $(value).position().left,
                    cellsTop = dinamicCell.position().top,
                    cellsLeft = dinamicCell.position().left;

                if(cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (endPositionY - (project.table.offset().top + cellsTop)) && cellTop < (project.mousePositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    $(value).addClass('selected');
                }
                if(cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (endPositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (project.mousePositionX - project.table.offset().left) || cellTop >= (project.mousePositionY - (project.table.offset().top + cellsTop)) && cellTop < (endPositionY - project.table.offset().top) && cellLeft >= (project.mousePositionX - (project.table.offset().left + cellsLeft)) && cellLeft < (endPositionX - project.table.offset().left)) {
                    $(value).addClass('selected');
                }
            });
        });

        $(window).mouseup(() => {
            $('.selectDiv').remove();
        });

    },

    deleteSelected: () => {
      $('.dinamicCell').removeClass('selected');
    },

    getCell: (x, y) => {
        return document.querySelector('[data-id= "'+x+'"] [data-id= "'+y+'"]');
    },

    selectMethods: () => {
        $(document).on('change', $('#selectAll'), () => {
            $.each($('.dinamicCell'), (key, value) => {
                $(value).toggleClass('selected');
                if($(value).hasClass('purple') || $(value).hasClass('green')) {
                    $(value).toggleClass('selected');
                }
            })
        }) ;

        $('#purple').click(() => {
            let cell = $('.dinamicCell'),
                selected = false,
                iterator = 0;

            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('purple') && iterator < 1 && !selected) {
                    $(value).removeClass('selected').removeClass('green').addClass('purple');
                    iterator++;
                    selected = true;
                }
            });

            if(iterator === 1) {
                toastr.error('Please select cell(s) before mark it');
            } else if(iterator > 1) {
                toastr.success('Cell(s) are marked');
            }

            if(!selected) {
                toastr.error('Please select cell(s) before mark it');
            }
        });

        $('#green').click(() => {
            let cell = $('.dinamicCell'),
                selected = false,
                iterator = 0;

            $.each(cell, (key, value) => {
                if($(value).hasClass('selected') || $(value).hasClass('green') && iterator < 1 && !selected) {
                    $(value).removeClass('selected').removeClass('purple').addClass('green');
                    iterator++;
                    selected = true;
                }
            });

            if(iterator === 1) {
                toastr.error('Please select cell(s) before mark it');
            } else if(iterator > 1) {
                toastr.success('Cell(s) are marked');
            }

            if(!selected) {
                toastr.error('Please select cell(s) before mark it');
            }
        });
    },
};
toastr.options.closeButton = true;
project.initDivs();
project.drawSelect();
project.selectMethods();