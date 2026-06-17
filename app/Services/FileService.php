<?php

namespace App\Services;



##################################

use App\Http\Requests\File\FileCreateRequest;
class FileService
{


    public function upload(FileCreateRequest $request)
    {
        $attributes = $request->validated();
        if (!$attributes) {
            return redirect()->back()->with('error', 'NOOOOOOOOOOOOOOOOOOOOOO!');
        }
        dd($attributes['files']);
        foreach ($attributes->file('files') as $file) {
            $file->store('uploads', 'public');
        }
    }

}