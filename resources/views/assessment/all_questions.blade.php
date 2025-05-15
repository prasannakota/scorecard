<!DOCTYPE html>
<html>
<head>
    <title>Assessment</title>
</head>
<body>


<form action="{{ url('/assessment/submit-all') }}" method="POST">
    @csrf

    @foreach ($questions as $question)
        <div>
            <h3>{{ $question->question_text }}</h3>
            <input type="radio" name="answers[{{ $question->id }}]" value="a" required> {{ $question->option_a }}<br>
            <input type="radio" name="answers[{{ $question->id }}]" value="b"> {{ $question->option_b }}<br>
            <input type="radio" name="answers[{{ $question->id }}]" value="c"> {{ $question->option_c }}<br>
            <input type="radio" name="answers[{{ $question->id }}]" value="d"> {{ $question->option_d }}<br>
            <input type="radio" name="answers[{{ $question->id }}]" value="e"> {{ $question->option_e }}<br>
        </div>
        <hr>
    @endforeach

    <button type="submit">Submit Assessment</button>
</form>


</body>
</html>
