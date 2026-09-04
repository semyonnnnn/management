<?php

// app/Exceptions/DepartmentImportException.php
namespace App\Exceptions;

class FormImportException extends \Exception
{
    public function __construct(string $message, public readonly array $rowErrors = [])
    {
        parent::__construct($message);
    }
}