<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $uploadedFile = $request->file('image');
        $image = Cloudinary::upload($uploadedFile->getRealPath(), [
            'folder' => 'mahalat',
        ]);

        return response()->json([
            'public_id' => $image->getPublicId(),
            'url' => $image->getSecurePath(),
        ]);
    }
}
