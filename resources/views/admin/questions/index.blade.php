@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Questions for {{ $department->name }}</h3>
                    <div class="card-tools">
                        <a href="{{ route('admin.departments.questions.create', $department) }}" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Add Question
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Sequence</th>
                                    <th>Question Text</th>
                                    <th>Revenue Range</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($questions as $question)
                                <tr>
                                    <td>{{ $question->id }}</td>
                                    <td>
                                        @if($question->conditions->isNotEmpty())
                                            {{ $question->conditions->first()->sequence_number }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td>{{ $question->question_text }}</td>
                                    <td>{{ $question->revenue_range }}</td>

                                    <td>{{ $question->is_active ? 'Active' : 'Inactive' }}</td>
                                    <td>
                                        <a href="{{ route('admin.departments.questions.edit', [$department, $question]) }}" class="btn btn-primary btn-sm">Edit</a>
                                        <form action="{{ route('admin.departments.questions.destroy', [$department, $question]) }}" method="POST" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    {{ $questions->links() }}
                </div>
            </div>
        </div>
    </div>
</div>





@section('scripts')
<script>
// Initialize Bootstrap tooltips
$(document).ready(function() {
    // Initialize the modal
    $('#editQuestionModal').modal({
        show: false
    });

    // Handle score link clicks
    $('.score-link').on('click', function(e) {
        e.preventDefault();
        
        const questionId = $(this).data('question-id');
        
        // Load the edit form via AJAX
        $.ajax({
            url: `{{ route('admin.departments.questions.edit', [$department, '__QUESTION_ID__']) }}`.replace('__QUESTION_ID__', questionId),
            method: 'GET',
            success: function(response) {
                // Extract the form from the response
                const form = $(response).find('form').first();
                
                // Update the modal content
                $('#editQuestionModal .modal-body').html(form);
                
                // Show the modal
                $('#editQuestionModal').modal('show');
            },
            error: function(xhr) {
                console.error('Error loading edit form:', xhr.responseText);
                alert('Error loading edit form. Please try again.');
            }
        });
    });

    // Handle form submission
    $(document).on('submit', '#editQuestionModal form', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const formData = new FormData(form[0]);
        const questionId = form.attr('action').match(/\d+/)[0];
        
        // Update the action URL with the actual question ID
        form.attr('action', form.attr('action').replace('__QUESTION_ID__', questionId));
        
        // Submit the form via AJAX
        $.ajax({
            url: form.attr('action'),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Close the modal
                $('#editQuestionModal').modal('hide');
                
                // Refresh the page to show updated question
                location.reload();
            },
            error: function(xhr) {
                // Handle validation errors
                const errors = xhr.responseJSON?.errors;
                if (errors) {
                    $.each(errors, function(field, messages) {
                        form.find(`[name="${field}"]`).addClass('is-invalid');
                        form.find(`[name="${field}"]`).siblings('.invalid-feedback').remove();
                        form.find(`[name="${field}"]`).after(`<div class="invalid-feedback">${messages[0]}</div>`);
                    });
                } else {
                    alert('Error saving question. Please try again.');
                }
            }
        });
    });

    // Handle modal close
    $('#editQuestionModal').on('hidden.bs.modal', function () {
        // Reset the form
        $(this).find('form')[0].reset();
        $(this).find('.is-invalid').removeClass('is-invalid');
        $(this).find('.invalid-feedback').remove();
        $(this).find('.modal-body').empty();
    });
});
</script>
@endsection
</div>
@endsection
