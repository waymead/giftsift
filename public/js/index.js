/* eslint-env jquery */
/* global dialogPolyfill */

$(document).ready(function () {
	$('.multi').select2({
		placeholder: 'Select lists'
	});

	$('.delete-list-button').each(function () {
		$(this).on('click', function () {
			deleteList($(this).attr('data-id'), $(this).attr('data-name'));
		});
	});

	$('.leave-list-button').each(function() {
		$(this).on('click', function() {
			leaveList($(this).attr('data-id'), $(this).attr('data-name'));
		});
	});	

	$('.delete-gift-button').each(function() {
		$(this).on('click', function () {
			deleteGift($(this).attr('data-id'), $(this).attr('data-name'), $(this).attr('data-listId'));
		});
	});

});

function deleteList(id, name) {
	const deleteDialog = document.querySelector('#delete-list-dialog');
	if (! deleteDialog.showModal) {
		dialogPolyfill.registerDialog(deleteDialog);
	}
	deleteDialog.showModal();
	deleteDialog.querySelector('.close-button').addEventListener('click', function() {
		deleteDialog.close();       
	});
	deleteDialog.querySelector('#dialog-title').innerText = name;
	deleteDialog.querySelector('.ok-button').href='/lists/delete/' + id;
}

function leaveList(id, name) {
	const leaveDialog = document.querySelector('#leave-list-dialog');
	if (! leaveDialog.showModal) {
		dialogPolyfill.registerDialog(leaveDialog);
	}
	leaveDialog.showModal();
	leaveDialog.querySelector('.close-button').addEventListener('click', function() {
		leaveDialog.close();       
	});
	leaveDialog.querySelector('#dialog-title').innerText = name;
	leaveDialog.querySelector('.ok-button').href='/lists/leave/' + id;
}

function deleteGift(id, name, listId) {
	var dialog = document.querySelector('#delete-gift-dialog');
	if (! dialog.showModal) {
		dialogPolyfill.registerDialog(dialog);
	}
	dialog.showModal();
	dialog.querySelector('.close-button').addEventListener('click', function() {
		dialog.close();       
	});
	dialog.querySelector('#gift-name').innerText = name;
	dialog.querySelector('.ok-button').href='/gifts/delete/' + id + '/' + listId;
}