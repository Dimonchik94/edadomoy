// $.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// });

$(document).ready(function () {
    //
    // $('.plus-item').click(function () {
    //     let id = $(this).attr("value");
    //     $.post('/ajax', {id}, function(data){
    //         console.log(data);
    //     });
    // });

    //Корзина
    //
    //Добавить товар
    $('.plus-item').click(function () {
        let id = $(this).attr("value");
        $.ajax({
            type:'POST',
            url:'/addItem',
            data: ({id: id}),
            success:function(data){
            }
        });
    });

    //Убрать товар
    $('.minus-item').click(function () {
        let id = $(this).attr("value");
        $.ajax({
            type:'POST',
            url:'/removeItem',
            data: ({id: id}),
            success:function(data){
            }
        });
    });

    //Удалить список товаров
    $('.remove-items-list').click(function () {
        let id = this.querySelector('.item_id').value;
        $.ajax({
            type:'POST',
            url:'/removeItemsList',
            data: ({id: id}),
            success:function(data){
                console.log(data);
            }
        });
    });

});



