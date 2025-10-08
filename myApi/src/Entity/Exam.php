<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ExamRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ExamRepository::class)]
#[ORM\Table(name: 'exam')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Put(),
        new Patch(),
        new Delete()
    ],
    normalizationContext: ['groups' => ['exam:read']],
    denormalizationContext: ['groups' => ['exam:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 20
)]
class Exam
{
    public const STATUS_CONFIRMED = 'Confirmé';
    public const STATUS_TO_ORGANIZE = 'À organiser';
    public const STATUS_CANCELLED = 'Annulé';
    public const STATUS_SEARCHING_LOCATION = 'En recherche de place';

    public const STATUSES = [
        self::STATUS_CONFIRMED,
        self::STATUS_TO_ORGANIZE,
        self::STATUS_CANCELLED,
        self::STATUS_SEARCHING_LOCATION
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['exam:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'exams')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'L\'étudiant est requis')]
    #[Groups(['exam:write'])]
    private ?Student $student = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Le lieu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull(message: 'La date de l\'examen est requise')]
    #[Assert\Type(type: \DateTimeInterface::class, message: 'La date doit être une date valide')]
    #[Assert\GreaterThanOrEqual(
        value: 'today',
        message: 'La date de l\'examen ne peut pas être dans le passé'
    )]
    #[Groups(['exam:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotNull(message: 'L\'heure de l\'examen est requise')]
    #[Assert\Type(type: \DateTimeInterface::class, message: 'L\'heure doit être une heure valide')]
    #[Groups(['exam:write'])]
    private ?\DateTimeInterface $time = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'Le statut de l\'examen est requis')]
    #[Assert\Choice(
        choices: self::STATUSES,
        message: 'Le statut doit être l\'une des valeurs suivantes : {{ choices }}'
    )]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $status = null;
  

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTime();
    }

    #[Groups(['exam:read'])]
    public function getStudentName(): ?string
    {
        return $this->student?->getName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): ?Student
    {
        return $this->student;
    }

    public function setStudent(?Student $student): static
    {
        $this->student = $student;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): static
    {
        $this->time = $time;

        return $this;
    }



    #[Groups(['exam:read'])]
    public function getFormattedTime(): ?string
    {
        return $this->getStatus() == self::STATUS_SEARCHING_LOCATION 
            ? 'En attente' 
            : $this->time?->format('H:i');
    }

    #[Groups(['exam:read'])] // Ce groupe sera exposé dans l’API
    public function getFormattedDate(): ?string
    {
        return $this->getStatus() == self::STATUS_SEARCHING_LOCATION 
            ? 'En attente' 
            : $this->date?->format('Y-m-d');
    }


    #[Groups(['exam:read'])]
    public function getFormattedFullDate(): ?string
    {
        return $this->date?->format('Y-m-d').' '. $this->time?->format('H:i'); 
    }



    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }
 
}