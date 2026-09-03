<?php

// app/Exceptions/DepartmentImportException.php
namespace App\Exceptions;

class DepartmentImportException extends \Exception
{
    public function __construct(string $message, public readonly array $rowErrors = [])
    {
        parent::__construct($message);
    }
}